import express from "express";
import {
  createPetition,
  getAllPetitions,
  getPetitionById,
} from "../controllers/petitionController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createPetition); 
router.get("/", getAllPetitions);
router.get("/:id", getPetitionById);

export default router;
