import express from "express";
import auth from "../middleware/auth.js";
import { generateReports } from "../controllers/reportController.js";

const router = express.Router();

router.get("/", auth, generateReports);

export default router;
