const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// Import des fichiers de routes (assurez-vous que chaque fichier fait un module.exports = router)
const login = require("./routers/login");
const analyse = require("./routers/analyse");
const signin = require("./routers/signin");
const logout = require("./routers/logout");

// Utilisation des routes
router.use("/login", login);
router.use("/analyse", analyse);
router.use("/signin", signin);
router.use("/logout", logout);
router.use("/token", (req, res) => {
  const refreshToken = req.cookies.token;

  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(refreshToken, process.env.jwt_secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Refresh Token" });

    // Create a NEW short-lived Access Token
    const newAccessToken = jwt.sign(
      { id: user.id, nom: user.nom, prenom: user.prenom },
      process.env.jwt_secret,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      accessToken: newAccessToken,
      user: { id: user.id, nom: user.nom, prenom: user.prenom },
    });
  });
});
module.exports = router;
