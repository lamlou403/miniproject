const jwt = require("jsonwebtoken");

const logedin = (req, res, next) => {
  console.log(req.cookies.token);
  // 2. Sinon, vérifier s'il y a un token JWT dans les headers
  const token = req.cookies.token; // Format: "Bearer TOKEN"
  console.log("token", token);
  if (!token) {
    console.log("token is not present");
    return res
      .status(401)
      .json({ message: "Accès refusé : utilisateur non connecté" });
  }

  try {
    // 3. Valider le token
    const verified = jwt.verify(token, process.env.jwt_secret);
    req.user = verified;
    console.log(verified);
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
