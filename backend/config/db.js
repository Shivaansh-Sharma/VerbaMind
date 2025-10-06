// backend/config/db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
 ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000, // 10 seconds

});

pool.on("connect", () => console.log("✅ Connected to PostgreSQL"));
pool.on("error", (err) => console.error("❌ DB Error:", err));

export { pool };
export default pool;
