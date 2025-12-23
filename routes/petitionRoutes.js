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
  const { category, location, status } = req.query;

  let filter = {};
  if (category) filter.category = category;
  if (location) filter.location = location;
  if (status) filter.status = status;

  const petitions = await Petition.find(filter);
  res.json(petitions);
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

