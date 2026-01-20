import Petition from "../models/petitions/Petition.js";
import AdminLog from "../models/logs/AdminLog.js";

export const getGovernancePetitions = async (req, res) => {
  if (req.user.role !== "official") {
    return res.status(403).json({ message: "Access denied" });
  }

  const filter = { targetLocation: req.user.location };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const petitions = await Petition.find(filter)
    .populate("creator", "name email")
    .sort({ createdAt: -1 });

  res.json(petitions);
};

export const respondToPetition = async (req, res) => {
  if (req.user.role !== "official") {
    return res.status(403).json({ message: "Access denied" });
  }

  const petition = await Petition.findById(req.params.id);
  if (!petition) return res.status(404).json({ message: "Not found" });

  if (petition.targetLocation !== req.user.location) {
    return res.status(403).json({ message: "Unauthorized location" });
  }

  petition.officialResponse = req.body.response;
  petition.respondedBy = req.user.id;
  petition.respondedAt = new Date();
  petition.status = req.body.status || "under_review";

  await petition.save();

  await AdminLog.create({
    action: "Responded to petition",
    user: req.user.id,
    petition: petition._id
  });

  res.json({ message: "Response saved" });
};
