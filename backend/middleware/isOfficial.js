module.exports = (req, res, next) => {
  if (req.user.role !== "official") {
    return res.status(403).json({ message: "Official access only" });
  }
  next();
};
