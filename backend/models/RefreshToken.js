// backend/models/RefreshToken.js
import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

/**
 * createRefreshToken: store hashed refresh token with expiry
 */
export async function createRefreshToken(userId, refreshTokenPlain, expiresAt) {
  const tokenHash = await bcrypt.hash(refreshTokenPlain, 10);
  const result = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3) RETURNING id, user_id, expires_at, revoked`,
    [userId, tokenHash, expiresAt]
  );
  return result.rows[0];
}

export async function findRefreshTokensByUserId(userId) {
  const result = await pool.query("SELECT id, token_hash, expires_at, revoked FROM refresh_tokens WHERE user_id = $1", [userId]);
  return result.rows;
}

export async function revokeRefreshTokenById(id) {
  await pool.query("UPDATE refresh_tokens SET revoked = true WHERE id = $1", [id]);
}

export async function revokeAllRefreshTokensForUser(userId) {
  await pool.query("UPDATE refresh_tokens SET revoked = true WHERE user_id = $1", [userId]);
}

export async function verifyRefreshTokenHash(storedHash, candidateTokenPlain) {
  return bcrypt.compare(candidateTokenPlain, storedHash);
}
