const express = require("express");
const router = express.Router();

// 1. Correction de la faute de frappe (LoginController au lieu de LogintController)
// 2. Utilisation de la destructuration { login } pour extraire la fonction
const { login } = require("../controller/LoginController");

// 3. Import du middleware de sécurité
const { ensureGuest } = require("../auth/LoginAuth");

// Route POST : Si l'utilisateur est un visiteur (ensureGuest), il peut tenter de se connecter
router.post("/", ensureGuest, login);

module.exports = router;