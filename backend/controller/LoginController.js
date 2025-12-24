const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // 1. Import de bcrypt indispensable

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Tentative de connexion pour l'email :", email);
    console.log("Mot de passe fourni :", password);
    // 1. Vérifier si l'utilisateur existe
    const user = await User.findOne({ email: email });
    console.log("Utilisateur trouvé :", user);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    // 2. Vérifier le mot de passe avec bcrypt.compare
    // On compare le texte clair (password) avec le hachage en base (user.password)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }


    // ----------------------------------------------------------------------------------

    // 3. Générer le Token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        nom: user.nom
      }, 
      'VOTRE_CLE_SECRETE', 
      { expiresIn: '24h' }
    );

    // 5. Réponse
    res.status(200).json({
      message: "Connexion réussie",
      token: token,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { login };