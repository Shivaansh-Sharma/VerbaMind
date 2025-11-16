// backend/models/EmailVerification.js
import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

const TABLE_NAME = "email_verification_otps";

// Create table automatically if it doesn't exist
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      otp_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

ensureTable().catch((err) => {
  console.error("Failed to ensure email_verification_otps table:", err);
});

export async function createEmailVerification({ name, email, passwordHash, otpPlain, expiresAt }) {
  const otpHash = await bcrypt.hash(otpPlain, 10);

  const result = await pool.query(
    `
    INSERT INTO ${TABLE_NAME} (email, name, password_hash, otp_hash, expires_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, name, password_hash, otp_hash, expires_at, created_at
    `,
    [email, name, passwordHash, otpHash, expiresAt]
  );

  return result.rows[0];
}

export async function findLatestVerificationByEmail(email) {
  const result = await pool.query(
    `
    SELECT id, email, name, password_hash, otp_hash, expires_at, created_at
    FROM ${TABLE_NAME}
    WHERE email = $1
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [email]
  );
  return result.rows[0] || null;
}

export async function deleteVerificationsForEmail(email) {
  await pool.query(`DELETE FROM ${TABLE_NAME} WHERE email = $1`, [email]);
}

export async function deleteVerificationById(id) {
  await pool.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, [id]);
}
