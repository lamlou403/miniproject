const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Erreur lors de la déconnexion");
    res.status(200).json({ message: "Déconnecté avec succès" });
  });
};
module.exports = {logout};