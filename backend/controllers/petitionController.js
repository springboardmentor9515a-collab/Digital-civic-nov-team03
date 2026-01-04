import Petition from "../models/petitions/Petition.js";
import Signature from "../models/signatures/Signature.js";

/**
 * CREATE PETITION
 */
export const createPetition = async (req, res) => {
  try {
    const petition = await Petition.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      creator: req.user.id, // from auth middleware
    });

    res.status(201).json(petition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePetition = async (req, res) => {
  try {
    const petition = await Petition.findByIdAndDelete(req.params.id);

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    res.status(200).json({ message: "Petition deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




/**
 * GET ALL PETITIONS (with filters)
 */
export const getAllPetitions = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (search)
      filter.title = { $regex: search, $options: "i" };

    const petitions = await Petition.find(filter)
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    // Add signature count
    const petitionsWithCount = await Promise.all(
      petitions.map(async (p) => {
        const count = await Signature.countDocuments({
          petitionId: p._id,
        });
        return { ...p._doc, signatureCount: count };
      })
    );

    res.json(petitionsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PETITION BY ID
 */
export const getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate("creator", "name email");

    if (!petition)
      return res.status(404).json({ message: "Petition not found" });

    const signatureCount = await Signature.countDocuments({
      petitionId: petition._id,
    });

    res.json({ ...petition._doc, signatureCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ... existing code

/**
 * GET DASHBOARD STATS
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const myPetitionsCount = await Petition.countDocuments({ creator: userId });

    // Placeholder logic for successful/active
    const myPetitions = await Petition.find({ creator: userId });

    res.json({
      myPetitions: myPetitionsCount,
      successful: 0,
      pollsCreated: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
