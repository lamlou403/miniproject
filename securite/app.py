import asyncio
import json
import socket
import ssl
import warnings
from datetime import datetime
from urllib.parse import urlparse

import requests
from bson.objectid import ObjectId
from nats.aio.client import Client as NATS
from pymongo import MongoClient
import os
warnings.filterwarnings("ignore", message="Unverified HTTPS request")


NATS_SERVER = os.environ["NATS_SERVER"]
NATS_SUBJECT = "security.scan"
MONGO_URI = os.environ["MONGO_URI"]
MONGO_DB = os.environ["MONGO_DB"]
MONGO_COLLECTION = "analyses"


def scan_website(url, timeout=10):
    """
    Scanner de sécurité web complet
    Args:
        url: URL cible à scanner
        timeout: Timeout pour les requêtes (défaut: 10s)
    Returns:
        dict: Rapport de sécurité détaillé
    """
    report = {
        "url": url,
        "scan_date": datetime.now().isoformat(),
        "vulnerabilities": [],
        "security_headers": {},
        "ssl_info": {},
        "recommendations": [],
    }

    try:
        # 1. Vérification des Headers HTTP de Sécurité
        headers_result = check_security_headers(url, timeout)
        report["security_headers"] = headers_result["headers"]
        report["vulnerabilities"].extend(headers_result["issues"])
        report["recommendations"].extend(headers_result["recommendations"])

        # 2. Vérification SSL/TLS
        ssl_result = check_ssl_certificate(url)
        report["ssl_info"] = ssl_result["info"]
        report["vulnerabilities"].extend(ssl_result["issues"])
        report["recommendations"].extend(ssl_result["recommendations"])

        # 3. Test XSS (Cross-Site Scripting)
        xss_result = test_xss_vulnerability(url, timeout)
        report["vulnerabilities"].extend(xss_result["issues"])
        report["recommendations"].extend(xss_result["recommendations"])

        # 4. Test SQL Injection
        sqli_result = test_sql_injection(url, timeout)
        report["vulnerabilities"].extend(sqli_result["issues"])
        report["recommendations"].extend(sqli_result["recommendations"])

        # Score de sécurité
        report["security_score"] = calculate_security_score(report)

    except Exception as e:
        report["error"] = str(e)

    return report


def check_security_headers(url, timeout):
    """Vérifie les headers de sécurité HTTP"""
    result = {"headers": {}, "issues": [], "recommendations": []}

    important_headers = {
        "Strict-Transport-Security": "HSTS manquant",
        "X-Content-Type-Options": "Protection contre MIME-sniffing manquante",
        "X-Frame-Options": "Protection contre clickjacking manquante",
        "Content-Security-Policy": "CSP manquante",
        "X-XSS-Protection": "Protection XSS manquante",
        "Referrer-Policy": "Politique de referrer manquante",
    }

    try:
        response = requests.get(
            url, timeout=timeout, verify=False, allow_redirects=True
        )

        for header, description in important_headers.items():
            value = response.headers.get(header)
            result["headers"][header] = value if value else "Absent"

            if not value:
                result["issues"].append(
                    {
                        "type": "Missing Security Header",
                        "severity": "Medium",
                        "header": header,
                        "description": description,
                    }
                )
                result["recommendations"].append(
                    f"Ajouter le header '{header}' pour améliorer la sécurité"
                )

        # Vérification du header Server (information disclosure)
        server_header = response.headers.get("Server")
        if server_header:
            result["issues"].append(
                {
                    "type": "Information Disclosure",
                    "severity": "Low",
                    "description": f"Le serveur expose sa version: {server_header}",
                }
            )
            result["recommendations"].append(
                "Masquer les informations du serveur pour réduire la surface d'attaque"
            )

    except requests.RequestException as e:
        result["issues"].append(
            {
                "type": "Connection Error",
                "severity": "High",
                "description": f"Impossible de se connecter: {str(e)}",
            }
        )

    return result


def check_ssl_certificate(url):
    """Vérifie le certificat SSL/TLS"""
    result = {"info": {}, "issues": [], "recommendations": []}

    parsed = urlparse(url)
    if parsed.scheme != "https":
        result["issues"].append(
            {
                "type": "SSL/TLS",
                "severity": "High",
                "description": "Le site n'utilise pas HTTPS",
            }
        )
        result["recommendations"].append(
            "Activer HTTPS avec un certificat SSL/TLS valide"
        )
        return result

    hostname = parsed.hostname
    port = parsed.port or 443

    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, port), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()

                result["info"]["issuer"] = dict(x[0] for x in cert.get("issuer", []))
                result["info"]["version"] = cert.get("version")
                result["info"]["notAfter"] = cert.get("notAfter")
                result["info"]["notBefore"] = cert.get("notBefore")

                # Vérifier l'expiration
                not_after = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
                days_remaining = (not_after - datetime.now()).days

                if days_remaining < 0:
                    result["issues"].append(
                        {
                            "type": "SSL Certificate",
                            "severity": "Critical",
                            "description": "Le certificat SSL a expiré",
                        }
                    )
                elif days_remaining < 30:
                    result["issues"].append(
                        {
                            "type": "SSL Certificate",
                            "severity": "Medium",
                            "description": f"Le certificat SSL expire dans {days_remaining} jours",
                        }
                    )
                    result["recommendations"].append(
                        "Renouveler le certificat SSL avant expiration"
                    )

    except ssl.SSLError as e:
        result["issues"].append(
            {
                "type": "SSL Error",
                "severity": "High",
                "description": f"Erreur SSL: {str(e)}",
            }
        )
        result["recommendations"].append("Vérifier la configuration SSL/TLS du serveur")
    except Exception as e:
        result["issues"].append(
            {
                "type": "SSL Check Failed",
                "severity": "Medium",
                "description": f"Impossible de vérifier SSL: {str(e)}",
            }
        )

    return result


def test_xss_vulnerability(url, timeout):
    """Test basique de vulnérabilités XSS"""
    result = {"issues": [], "recommendations": []}

    xss_payloads = [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>",
        "javascript:alert('XSS')",
        "<svg/onload=alert('XSS')>",
    ]

    parsed = urlparse(url)
    test_params = ["q", "search", "query", "id", "name"]

    for param in test_params:
        for payload in xss_payloads:
            test_url = f"{url}{'&' if parsed.query else '?'}{param}={payload}"

            try:
                response = requests.get(test_url, timeout=timeout, verify=False)

                # Vérification simplifiée: le payload est-il reflété sans encodage?
                if payload in response.text:
                    result["issues"].append(
                        {
                            "type": "Reflected XSS",
                            "severity": "High",
                            "description": f"Possible XSS via paramètre '{param}'",
                            "payload": payload,
                            "url": test_url,
                        }
                    )
                    result["recommendations"].append(
                        f"Encoder/filtrer les entrées utilisateur pour le paramètre '{param}'"
                    )
                    break  # Une vulnérabilité trouvée suffit par paramètre

            except requests.RequestException:
                continue

    if not result["issues"]:
        result["recommendations"].append(
            "Aucune vulnérabilité XSS évidente détectée (tests basiques)"
        )

    return result


def test_sql_injection(url, timeout):
    """Test basique de vulnérabilités SQL Injection"""
    result = {"issues": [], "recommendations": []}

    sqli_payloads = [
        "' OR '1'='1",
        "' OR '1'='1' --",
        "admin' --",
        "' UNION SELECT NULL--",
        "1' AND '1'='1",
    ]

    sql_error_patterns = [
        "sql syntax",
        "mysql",
        "postgresql",
        "sqlite",
        "ora-",
        "syntax error",
        "unclosed quotation",
        "you have an error in your sql",
    ]

    parsed = urlparse(url)
    test_params = ["id", "user", "name", "category", "product"]

    for param in test_params:
        for payload in sqli_payloads:
            test_url = f"{url}{'&' if parsed.query else '?'}{param}={payload}"

            try:
                response = requests.get(test_url, timeout=timeout, verify=False)
                response_lower = response.text.lower()

                # Recherche de messages d'erreur SQL
                for pattern in sql_error_patterns:
                    if pattern in response_lower:
                        result["issues"].append(
                            {
                                "type": "SQL Injection",
                                "severity": "Critical",
                                "description": f"Possible SQLi via paramètre '{param}'",
                                "payload": payload,
                                "error_found": pattern,
                                "url": test_url,
                            }
                        )
                        result["recommendations"].append(
                            f"Utiliser des requêtes préparées pour le paramètre '{param}'"
                        )
                        break

            except requests.RequestException:
                continue

    if not result["issues"]:
        result["recommendations"].append(
            "Aucune vulnérabilité SQLi évidente détectée (tests basiques)"
        )

    return result


def calculate_security_score(report):
    """Calcule un score de sécurité basé sur les vulnérabilités"""
    score = 100

    for vuln in report["vulnerabilities"]:
        severity = vuln.get("severity", "Low")
        if severity == "Critical":
            score -= 20
        elif severity == "High":
            score -= 10
        elif severity == "Medium":
            score -= 5
        elif severity == "Low":
            score -= 2

    return max(0, score)


def print_report(report):
    """Affiche le rapport de manière formatée"""
    print("\n" + "=" * 60)
    print(f"RAPPORT DE SÉCURITÉ WEB")
    print("=" * 60)
    print(f"URL: {report['url']}")
    print(f"Date: {report['scan_date']}")
    print(f"Score de sécurité: {report.get('security_score', 'N/A')}/100")
    print("=" * 60)

    print("\n📋 VULNÉRABILITÉS DÉTECTÉES:")
    if report["vulnerabilities"]:
        for i, vuln in enumerate(report["vulnerabilities"], 1):
            print(
                f"\n{i}. [{vuln.get('severity', 'Unknown')}] {vuln.get('type', 'Unknown')}"
            )
            print(f"   Description: {vuln.get('description', 'N/A')}")
    else:
        print("   ✓ Aucune vulnérabilité majeure détectée")

    print("\n💡 RECOMMANDATIONS:")
    for i, rec in enumerate(report["recommendations"][:10], 1):
        print(f"{i}. {rec}")

    print("\n" + "=" * 60)


# ========== NOUVELLES FONCTIONS NATS + MONGODB ==========


def update_mongo_document(document_id, scan_data):
    """
    Met à jour un document MongoDB avec les résultats du scan
    Args:
        document_id: ID du document MongoDB (string)
        scan_data: Données du scan à insérer
    """
    try:
        client = MongoClient(MONGO_URI)
        db = client[MONGO_DB]
        collection = db[MONGO_COLLECTION]

        # Mettre à jour le document
        result = collection.update_one(
            {"_id": ObjectId(document_id)},
            {"$set": {"data": scan_data, "done": True, "donetime": datetime.now()}},
        )

        if result.matched_count > 0:
            print(f"✓ Document {document_id} mis à jour avec succès")
            return True
        else:
            print(f"✗ Document {document_id} non trouvé")
            return False

    except Exception as e:
        print(f"✗ Erreur lors de la mise à jour MongoDB: {e}")
        return False
    finally:
        client.close()


async def message_handler(msg):
    """
    Gestionnaire de messages NATS
    Attend un message JSON avec: {"url": "...", "document_id": "..."}
    """
    subject = msg.subject
    data = msg.data.decode()

    print(f"\n📨 Message reçu sur {subject}")

    try:
        # Parser le message JSON
        message_data = json.loads(data)
        url = message_data.get("url")
        document_id = message_data.get("document_id")

        if not url or not document_id:
            print("✗ Message invalide: 'url' et 'document_id' requis")
            return

        print(f"🔍 Scan en cours pour: {url}")
        print(f"📄 Document ID: {document_id}")

        # Effectuer le scan
        scan_report = scan_website(url)

        # Afficher le rapport
        print_report(scan_report)

        # Mettre à jour MongoDB
        success = update_mongo_document(document_id, scan_report)

        if success:
            print(f"✅ Traitement terminé avec succès")
        else:
            print(f"⚠️ Échec de la mise à jour MongoDB")

    except json.JSONDecodeError as e:
        print(f"✗ Erreur de parsing JSON: {e}")
    except Exception as e:
        print(f"✗ Erreur lors du traitement: {e}")


async def run_nats_listener():
    """
    Lance le listener NATS
    """
    nc = NATS()

    try:
        # Connexion à NATS
        await nc.connect(NATS_SERVER)
        print(f"✓ Connecté à NATS: {NATS_SERVER}")
        print(f"👂 En écoute sur le sujet: {NATS_SUBJECT}")
        print("⏳ En attente de messages...\n")

        # S'abonner au sujet
        await nc.subscribe(NATS_SUBJECT, cb=message_handler)

        # Garder le programme en cours d'exécution
        while True:
            await asyncio.sleep(1)

    except Exception as e:
        print(f"✗ Erreur NATS: {e}")
    finally:
        await nc.close()


if __name__ == "__main__":
    print("=" * 60)
    print("🔒 SCANNER DE SÉCURITÉ WEB - MODE NATS")
    print("=" * 60)

    # Lancer le listener NATS
    asyncio.run(run_nats_listener())
