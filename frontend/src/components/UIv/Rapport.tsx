import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar,
  Globe,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllLinks, addLink } from "@/API/Links";

const SecurityReport = () => {
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    getAllLinks()
      .then((data) => {
        data.forEach((link) => {
          console.log("link :", link);
          if (link._id === id) {
            setReportData({ ...link.data, ...link });
            console.log("score", link.data.security_score, {
              ...link.data,
              ...link,
            });
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);
  if (!reportData) return <div>Loading...{id}</div>;
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "low":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const generatePDF = () => {
    const printWindow = window.open("", "_blank");
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Security Report - ${reportData.url}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1e40af;
              font-size: 32px;
              margin-bottom: 10px;
            }
            .header .url {
              color: #2563eb;
              font-size: 18px;
              font-weight: 500;
            }
            .score-section {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 12px;
              text-align: center;
              margin-bottom: 30px;
            }
            .score {
              font-size: 72px;
              font-weight: bold;
              margin: 10px 0;
            }
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .section-title {
              font-size: 20px;
              color: #1e40af;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 10px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .vulnerability {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin-bottom: 15px;
              border-radius: 4px;
            }
            .vulnerability-header {
              font-weight: 600;
              color: #92400e;
              margin-bottom: 5px;
            }
            .severity {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
              margin-left: 10px;
            }
            .severity-low { background: #fef3c7; color: #92400e; }
            .severity-medium { background: #fed7aa; color: #9a3412; }
            .severity-high { background: #fecaca; color: #991b1b; }
            .header-item {
              background: #f3f4f6;
              padding: 12px;
              margin-bottom: 10px;
              border-radius: 4px;
              border-left: 3px solid #2563eb;
            }
            .header-name {
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 5px;
            }
            .header-value {
              color: #4b5563;
              font-size: 13px;
              word-break: break-all;
            }
            .ssl-info {
              background: #f0fdf4;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #bbf7d0;
            }
            .ssl-item {
              margin-bottom: 8px;
            }
            .ssl-label {
              font-weight: 600;
              color: #166534;
              display: inline-block;
              min-width: 120px;
            }
            .recommendation {
              background: #eff6ff;
              padding: 12px;
              margin-bottom: 10px;
              border-radius: 4px;
              border-left: 3px solid #3b82f6;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { padding: 20px; }
              .score-section { background: #667eea !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔒 Rapport de Sécurité Web</h1>
            <div class="url">${reportData.url}</div>
            <div style="margin-top: 10px; color: #6b7280;">
              Date du scan:${new Date(reportData.timeinit).toLocaleString("fr-FR")}
            </div>
          </div>

          <div class="score-section">
            <div style="font-size: 18px; opacity: 0.9;">Score de Sécurité</div>
            <div class="score">${reportData.security_score}/100</div>
            <div style="font-size: 16px; opacity: 0.9;">Excellent niveau de sécurité</div>
          </div>

          <div class="section">
            <div class="section-title">🚨 Vulnérabilités Détectées</div>
            ${reportData.vulnerabilities
              .map(
                (vuln) => `
              <div class="vulnerability">
                <div class="vulnerability-header">
                  ${vuln.type}
                  <span class="severity severity-${vuln.severity.toLowerCase()}">${vuln.severity}</span>
                </div>
                <div>${vuln.description}</div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="section">
            <div class="section-title">🛡️ En-têtes de Sécurité</div>
            ${Object.entries(reportData.security_headers)
              .map(
                ([key, value]) => `
              <div class="header-item">
                <div class="header-name">${key}</div>
                <div class="header-value">${value}</div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="section">
            <div class="section-title">🔐 Informations SSL/TLS</div>
            <div class="ssl-info">
              <div class="ssl-item">
                <span class="ssl-label">Émetteur:</span>
                ${reportData.ssl_info.issuer.commonName}
              </div>
              <div class="ssl-item">
                <span class="ssl-label">Organisation:</span>
                ${reportData.ssl_info.issuer.organizationName}
              </div>
              <div class="ssl-item">
                <span class="ssl-label">Pays:</span>
                ${reportData.ssl_info.issuer.countryName}
              </div>
              <div class="ssl-item">
                <span class="ssl-label">Valide du:</span>
                ${reportData.ssl_info.notBefore}
              </div>
              <div class="ssl-item">
                <span class="ssl-label">Valide jusqu'au:</span>
                ${reportData.ssl_info.notAfter}
              </div>
              <div class="ssl-item">
                <span class="ssl-label">Version:</span>
                ${reportData.ssl_info.version}
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">💡 Recommandations</div>
            ${reportData.recommendations
              .map(
                (rec) => `
              <div class="recommendation">✓ ${rec}</div>
            `,
              )
              .join("")}
          </div>

          <div class="footer">
            <p>Rapport généré automatiquement le ${new Date().toLocaleString("fr-FR")}</p>
            <p>Ce rapport est confidentiel et destiné uniquement à l'usage interne</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 ">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Rapport de Sécurité
                </h1>
                <p className="text-gray-600 mt-1">
                  Analyse complète de la sécurité web
                </p>
              </div>
            </div>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              Exporter PDF
            </button>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="font-medium">{reportData.url}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(reportData.timeinit).toLocaleString("fr-FR")}
              </span>
            </div>
          </div>
        </div>

        {/* Security Score */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="text-center">
            <p className="text-lg opacity-90 mb-2">Score de Sécurité</p>
            <p className={`text-7xl font-bold mb-2`}>
              {reportData.security_score}
            </p>
            <p className="text-xl opacity-90">/ 100</p>
            <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-1000"
                style={{ width: `${reportData.securityScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Vulnerabilities */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Vulnérabilités Détectées
            </h2>
          </div>
          <div className="space-y-4">
            {reportData.vulnerabilities.map((vuln, idx) => (
              <div
                key={idx}
                className={`border-2 rounded-xl p-5 ${getSeverityColor(vuln.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{vuln.type}</h3>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold">
                    {vuln.severity}
                  </span>
                </div>
                <p className="text-sm">{vuln.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Headers */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              En-têtes de Sécurité
            </h2>
          </div>
          <div className="space-y-3">
            {Object.entries(reportData.security_headers).map(
              ([key, value], idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600"
                >
                  <div className="font-semibold text-gray-900 mb-1">{key}</div>
                  <div className="text-sm text-gray-600 break-all">{value}</div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* SSL Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Informations SSL/TLS
            </h2>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-green-900">Émetteur:</span>
                <p className="text-green-700">
                  {reportData.ssl_info.issuer.commonName}
                </p>
              </div>
              <div>
                <span className="font-semibold text-green-900">
                  Organisation:
                </span>
                <p className="text-green-700">
                  {reportData.ssl_info.issuer.organizationName}
                </p>
              </div>
              <div>
                <span className="font-semibold text-green-900">Valide du:</span>
                <p className="text-green-700">
                  {reportData.ssl_info.notBefore}
                </p>
              </div>
              <div>
                <span className="font-semibold text-green-900">
                  Valide jusqu'au:
                </span>
                <p className="text-green-700">{reportData.ssl_info.notAfter}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Recommandations
            </h2>
          </div>
          <div className="space-y-3">
            {reportData.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-blue-50 rounded-lg p-4"
              >
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SecurityReport;
