const express = require("express");
const router = express.Router();

// Import des fichiers de routes (assurez-vous que chaque fichier fait un module.exports = router)
const login = require("./routers/login");
const analyse = require("./routers/analyse");
const signin = require("./routers/signin");
const logout = require("./routers/logout");

// Utilisation des routes
router.use("/login", login);
router.use("/analyse", analyse);
router.use("/signin", signin);
router.use("/logout", logout); // Changé /signout en /logout pour être cohérent avec le nom de variable

module.exports = router;