// backend/models/Result.js
import { pool } from "../config/db.js";

/**
 * Create an analyzer result row.
 * Required fields are enforced by DB CHECK constraints.
 */
export async function createAnalyzerResult({
  userId,
  sentiment = null,
  language,
  grammar,
  tone,
  plagiarism,
  input_text,
}) {
  const query = `
    INSERT INTO results (
      user_id, type, sentiment, language, grammar, tone, plagiarism, input_text
    )
    VALUES ($1, 'analyzer', $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    userId,
    sentiment,
    language,
    grammar,
    tone,
    plagiarism,
    input_text,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

/**
 * Create a summarizer result row.
 */
export async function createSummarizerResult({
  userId,
  sentiment = null,
  topic,
  summary,
  input_text,
}) {
  const query = `
    INSERT INTO results (
      user_id, type, sentiment, topic, summary, input_text
    )
    VALUES ($1, 'summarizer', $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [userId, sentiment, topic, summary, input_text];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

/**
 * Get a page of results for a user.
 * type can be "analyzer" | "summarizer" | undefined
 */
export async function getResultsForUser(
  userId,
  { type, limit = 20, offset = 0 } = {}
) {
  let query = `
    SELECT
      id,
      user_id,
      type,
      sentiment,
      language,
      grammar,
      tone,
      plagiarism,
      topic,
      summary,
      created_at,
      input_text
    FROM results
    WHERE user_id = $1
  `;
  const values = [userId];

  if (type) {
    query += ` AND type = $${values.length + 1}`;
    values.push(type);
  }

  // newest first
  query += ` ORDER BY created_at DESC`;

  // pagination
  query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);

  const { rows } = await pool.query(query, values);
  return rows;
}

/**
 * Get a single result by id for a user (for security).
 */
export async function getResultByIdForUser(id, userId) {
  const query = `
    SELECT
      id,
      user_id,
      type,
      sentiment,
      language,
      grammar,
      tone,
      plagiarism,
      topic,
      summary,
      created_at,
      input_text
    FROM results
    WHERE id = $1 AND user_id = $2
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [id, userId]);
  return rows[0] || null;
}
