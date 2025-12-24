const jwt = require('jsonwebtoken');

const logedin = (req, res, next) => {
  // 1. Vérifier si l'utilisateur est connecté via la session
  if (req.session && req.session.user) {
    return next(); // L'utilisateur est loggé, on continue
  }

  // 2. Sinon, vérifier s'il y a un token JWT dans les headers
  const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Accès refusé : utilisateur non connecté" });
  }

  try {
    // 3. Valider le token
    const verified = jwt.verify(token,'VOTRE_CLE_SECRETE');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token invalide" });
  }
};
const ensureGuest = (req, res, next) => {
  if (req.session && req.session.isLogined) {
    // Si déjà connecté, on empêche d'aller sur la page login
    return res.status(403).json({ message: "Vous êtes déjà connecté." });
  }
  // Si PAS connecté, on autorise l'accès à la suite (la fonction login)
  next();
};
module.exports = { logedin, ensureGuest };