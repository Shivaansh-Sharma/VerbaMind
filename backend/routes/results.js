// backend/routes/results.js
import express from "express";
import { authMiddleware } from "../utils/authMiddleware.js";
import {
  listResults,
  getResult,
  createAnalyzer,
  createSummarizer,
} from "../controllers/resultController.js";

const router = express.Router();

// All result routes require auth
router.use(authMiddleware);

// History list
router.get("/", listResults);

// Single result detail
router.get("/:id", getResult);

// Optional: endpoints to create results from your analyzer/summarizer
router.post("/analyzer", createAnalyzer);
router.post("/summarizer", createSummarizer);

export default router;
