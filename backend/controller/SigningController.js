const User = require('../models/User');
const bcrypt = require('bcrypt'); // Import de bcrypt

const SignIn = async (req, res) => {
  try {
    const { nom, prenom, dateNaissance, email, password } = req.body;

    // 1. Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // --- AJOUT DU CRYPTAGE ---
    // On génère un "salt" (sel) pour complexifier le hachage
    const salt = await bcrypt.genSalt(10);
    // On hache le mot de passe
    const hashedPassword = await bcrypt.hash(password, salt);
    // -------------------------

    // 2. Créer le nouvel utilisateur avec le mot de passe haché
    const newUser = new User({
      nom,
      prenom,
      dateNaissance,
      email,
      password: hashedPassword // On enregistre la version hachée
    });

    // 3. Sauvegarder dans MongoDB
    await newUser.save();

    // 4. Réponse de succès
    res.status(201).json({
      message: "Utilisateur créé avec succès !",
      user: {
        id: newUser._id,
        nom: newUser.nom,
        email: newUser.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

module.exports = { SignIn };