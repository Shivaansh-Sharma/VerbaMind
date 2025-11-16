// backend/controllers/resultController.js
import {
  createAnalyzerResult,
  createSummarizerResult,
  getResultsForUser,
  getResultByIdForUser,
} from "../models/Result.js";

/**
 * GET /results
 * Optional query params:
 *  - type=analyzer|summarizer
 *  - page (1-based)
 *  - limit
 */
export async function listResults(req, res) {
  try {
    const userId = req.user.id;
    const { type, page = "1", limit = "20" } = req.query;

    if (type && type !== "analyzer" && type !== "summarizer") {
      return res.status(400).json({ error: "Invalid type" });
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const offset = (pageNum - 1) * pageLimit;

    const results = await getResultsForUser(userId, {
      type,
      limit: pageLimit,
      offset,
    });

    return res.json({
      results,
      page: pageNum,
      limit: pageLimit,
      count: results.length,
    });
  } catch (err) {
    console.error("Error listing results:", err);
    return res.status(500).json({ error: "Server error listing results" });
  }
}

/**
 * GET /results/:id
 */
export async function getResult(req, res) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid result id" });
    }

    const result = await getResultByIdForUser(id, userId);

    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    return res.json({ result });
  } catch (err) {
    console.error("Error getting result:", err);
    return res.status(500).json({ error: "Server error fetching result" });
  }
}

/**
 * POST /results/analyzer
 * Body: { sentiment?, language, grammar, tone, plagiarism, input_text }
 */
export async function createAnalyzer(req, res) {
  try {
    const userId = req.user.id;
    const {
      sentiment = null,
      language,
      grammar,
      tone,
      plagiarism,
      input_text,
    } = req.body;

    if (
      language === undefined ||
      grammar === undefined ||
      tone === undefined ||
      plagiarism === undefined ||
      input_text === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created = await createAnalyzerResult({
      userId,
      sentiment,
      language,
      grammar,
      tone,
      plagiarism,
      input_text,
    });

    return res.status(201).json({ result: created });
  } catch (err) {
    console.error("Error creating analyzer result:", err);
    return res.status(500).json({ error: "Server error creating result" });
  }
}

/**
 * POST /results/summarizer
 * Body: { sentiment?, topic, summary, input_text }
 */
export async function createSummarizer(req, res) {
  try {
    const userId = req.user.id;
    const { sentiment = null, topic, summary, input_text } = req.body;

    if (topic === undefined || summary === undefined || input_text === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created = await createSummarizerResult({
      userId,
      sentiment,
      topic,
      summary,
      input_text,
    });

    return res.status(201).json({ result: created });
  } catch (err) {
    console.error("Error creating summarizer result:", err);
    return res.status(500).json({ error: "Server error creating result" });
  }
}
