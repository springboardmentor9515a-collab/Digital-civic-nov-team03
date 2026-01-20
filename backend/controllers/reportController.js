import Petition from "../models/petitions/Petition.js";
import Signature from "../models/signatures/Signature.js";
import Vote from "../models/votes/Vote.js";

export const generateReports = async (req, res) => {
  if (req.user.role !== "official") {
    return res.status(403).json({ message: "Access denied" });
  }

  const petitionsByStatus = await Petition.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const signatureTotals = await Signature.aggregate([
    { $group: { _id: "$petitionId", total: { $sum: 1 } } }
  ]);

  const pollVotes = await Vote.aggregate([
    { $group: { _id: "$poll", totalVotes: { $sum: 1 } } }
  ]);

  res.json({
    petitionsByStatus,
    signatureTotals,
    pollVotes
  });
};
