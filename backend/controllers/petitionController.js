const Petition = require("../models/Petition");
const Signature = require("../models/Signature");

/* ================= CREATE PETITION ================= */
exports.createPetition = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const petition = await Petition.create({
      title,
      description,
      category,
      location,
      creator: req.user._id,
    });

    res.status(201).json(petition);
  } catch (error) {
    res.status(500).json({ message: "Failed to create petition" });
  }
};

/* ================= GET ALL PETITIONS ================= */
exports.getAllPetitions = async (req, res) => {
  try {
    const { location, category, status } = req.query;

    let filter = {};

    if (location) filter.location = location;
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Officials → only their location
    if (req.user?.role === "official") {
      filter.location = req.user.location;
    }

    const petitions = await Petition.find(filter).sort({ createdAt: -1 });
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch petitions" });
  }
};

/* ================= GET PETITION BY ID ================= */
exports.getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate("creator", "name role location");

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    const signatureCount = await Signature.countDocuments({
      petition: req.params.id,
    });

    res.json({ petition, signatureCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch petition" });
  }
};

/* ================= SIGN PETITION ================= */
exports.signPetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    if (petition.status !== "active") {
      return res
        .status(400)
        .json({ message: "Petition is not active" });
    }

    await Signature.create({
      petition: req.params.id,
      user: req.user._id,
    });

    res.json({ message: "Petition signed successfully" });
  } catch (error) {
    res.status(400).json({ message: "Already signed petition" });
  }
};
