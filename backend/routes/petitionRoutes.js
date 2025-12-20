const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const isCitizen = require("../middleware/isCitizen");

const {
  createPetition,
  getAllPetitions,
  getPetitionById,
  signPetition,
} = require("../controllers/petitionController");

// Create petition (citizen only)
router.post("/", auth, isCitizen, createPetition);

// Get all petitions (public / auth optional)
router.get("/", auth, getAllPetitions);

// Get petition by ID
router.get("/:id", auth, getPetitionById);

// Sign petition (citizen only)
router.post("/:id/sign", auth, isCitizen, signPetition);

module.exports = router;
