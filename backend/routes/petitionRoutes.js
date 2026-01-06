import express from "express";
import {
  createPetition,
  getAllPetitions,
  getPetitionById,
  getDashboardStats,
   deletePetition 
} from "../controllers/petitionController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createPetition);
router.get("/", getAllPetitions);
router.get("/stats", auth, getDashboardStats);
router.get("/:id", getPetitionById);
router.delete("/:id", auth, deletePetition);



export default router;
