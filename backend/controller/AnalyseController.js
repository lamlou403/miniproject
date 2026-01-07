// Vérifiez si votre dossier s'appelle 'models' ou 'model'
// Si le contrôleur est dans /controller et le modèle dans /models :
const Analyse = require("../models/Analyse");
const { send } = require("../Singletons/natSingleton.js");
// 1. Ajouter une nouvelle analyse
const SetAnalyse = async (req, res) => {
  try {
    const { url, data } = req.body;

    // Récupération de l'ID depuis la session (configuré dans votre LoginAuth)
    const userId = req.user.id;

    if (!userId) {
      console.log("Utilisateur non authentifié");
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const nouvelleAnalyse = new Analyse({
      url,
      iduser: userId,
      data: data || {},
      timeinit: new Date(),
      done: false,
    });

    const savedAnalyse = await nouvelleAnalyse.save();
    send(url, savedAnalyse._id)
      .then()
      .catch((err) => console.error(err));
    res.status(201).json(savedAnalyse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création", error: error.message });
  }
};

// 2. Récupérer les analyses de l'utilisateur connecté
const GetAnalyse = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // On utilise l'ID de session pour filtrer les résultats
    const analyses = await Analyse.find({ iduser: userId }).populate(
      "iduser",
      "nom prenom",
    );

    res.status(200).json(analyses);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération",
      error: error.message,
    });
  }
};

module.exports = {
  SetAnalyse,
  GetAnalyse,
};
