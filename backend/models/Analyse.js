const mongoose = require('mongoose');

const analyseSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  timeinit: {
    type: Date,
    default: Date.now // Définit la date actuelle par défaut
  },
  done: {
    type: Boolean,
    default: false
  },
  donetime: {
    type: Date,
    default: null // Initialisé à null tant que l'analyse n'est pas finie
  },
  iduser: {
    type: String, // Ou mongoose.Schema.Types.ObjectId si vous liez à une collection User
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Permet de stocker n'importe quel objet JSON
    default: {}
  }
}, {
  timestamps: true // Optionnel : ajoute automatiquement createdAt et updatedAt
});


module.exports = mongoose.model('Analyse', analyseSchema);