module.exports = (req, res, next) => {
  if (req.user.role !== "citizen") {
    return res.status(403).json({ message: "Citizen access only" });
  }
  next();
};
