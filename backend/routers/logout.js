const express = require("express");
const router = express.Router();

// 1. Import avec destructuration car LogoutController exporte souvent un objet
const { logout } = require("../controller/LogoutController");

// 2. Import du middleware qui vérifie si l'utilisateur est bien connecté avant de le déconnecter
const { logedin } = require("../auth/LoginAuth");

// 3. Route POST pour la déconnexion
// On vérifie d'abord si l'utilisateur est loggé, puis on exécute le logout
router.post("/", logedin, logout);

module.exports = router;