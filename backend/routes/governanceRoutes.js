import express from "express";
import auth from "../middleware/auth.js";
import {
  getGovernancePetitions,
  respondToPetition
} from "../controllers/governanceController.js";

const router = express.Router();

router.get("/petitions", auth, getGovernancePetitions);
router.post("/petitions/:id/respond", auth, respondToPetition);

export default router;
