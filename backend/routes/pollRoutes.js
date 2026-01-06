import express from "express";
import auth from "../middleware/auth.js";
import {
  createPoll,
  getPolls,
  getPollById,
  voteOnPoll
} from "../controllers/pollController.js";

const router = express.Router();

router.post("/", auth, createPoll);
router.get("/", auth, getPolls);
router.get("/:id", auth, getPollById);
router.post("/:id/vote", auth, voteOnPoll);

export default router;
