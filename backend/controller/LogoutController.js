const logout = (req, res) => {
  res.clearCookie("token");
  res.send({ message: "done" });
};
module.exports = { logout };