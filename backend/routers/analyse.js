const express = require("express");
const router = express.Router();

// 1. Import des fonctions du contrôleur
const { GetAnalyse, SetAnalyse } = require("../controller/AnalyseController");

// 2. Import du middleware de vérification de session
// Note : J'ai utilisé 'logedin' car c'est le nom que vous avez utilisé dans les routes
const { logedin } = require("../auth/LoginAuth");

// 3. Définition des routes protégées par le middleware 'logedin'
router.post("/", logedin, SetAnalyse);
router.get("/", logedin, GetAnalyse);

module.exports = router;