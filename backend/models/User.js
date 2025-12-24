const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, "Le prénom est obligatoire"],
    trim: true
  },
  dateNaissance: {
    type: Date,
    required: [true, "La date de naissance est obligatoire"]
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true, // Empêche les doublons
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez utiliser un email valide']
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: 8 // Sécurité minimale
  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt automatiquement
});



module.exports = mongoose.model('User', userSchema);