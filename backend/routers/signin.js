const express = require("express");
const router = express.Router();

// Vérifiez bien le nom du fichier (SigninController ou UserController)
const { SignIn } = require("../controller/SigningController");

// Le middleware qui vérifie si l'utilisateur n'est pas déjà loggé
const { ensureGuest } = require("../auth/LoginAuth");

// Route POST pour l'inscription
// Accessible uniquement si non connecté (ensureGuest)
router.post("/", ensureGuest, SignIn);

module.exports = router;