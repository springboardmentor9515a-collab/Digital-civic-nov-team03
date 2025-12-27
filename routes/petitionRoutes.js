const express = require("express");
const router = express.Router();
const Petition = require("../models/Petition");
const Signature = require("../models/Signature");

// CREATE petition
router.post("/", async (req, res) => {
  const petition = await Petition.create(req.body);
  res.json(petition);
});

// GET petitions
router.get("/", async (req, res) => {
  try {
    const { location, category, status } = req.query;

    let filter = {};

    if (location) {
      filter.location = location;
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    const petitions = await Petition.find(filter);
    res.status(200).json(petitions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// SIGN petition
router.post("/:id/sign", async (req, res) => {
  const petitionId = req.params.id;

  await Signature.create({
    petitionId: petitionId,
    userId: "demo-user",
  });

  res.json({ message: "Petition signed successfully" });
});

module.exports = router;

