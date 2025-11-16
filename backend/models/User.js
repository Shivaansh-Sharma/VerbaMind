// backend/models/User.js
import { pool } from "../config/db.js";

/**
 * createUser: password must be hashed already (NOT NULL)
 */
export async function createUser(name, email, hashedPassword) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, name, email`,
    [name, email, hashedPassword]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

export async function findUserById(id) {
  const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

export async function updateUserName(id, name) {
  const result = await pool.query(
    `UPDATE users
     SET name = $2
     WHERE id = $1
     RETURNING id, name, email`,
    [id, name]
  );

  return result.rows[0];
}

export async function updateUserPassword(id, hashedPassword) {
  const result = await pool.query(
    `UPDATE users
     SET password = $2
     WHERE id = $1
     RETURNING id, name, email`,
    [id, hashedPassword]
  );

  return result.rows[0];
}
