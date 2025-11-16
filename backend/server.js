// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import { pool } from "./config/db.js";
import "./config/passport.js"; // initialize passport strategies

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV || "development";
const SESSION_SECRET = process.env.SESSION_SECRET || "supersecretchangeinprod";

// 🔥 REQUIRED on Render / any proxy for secure cookies
app.set("trust proxy", 1);

// CORS allowing credentials for cookies
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

// ⭐ MOST IMPORTANT FIX ⭐
app.use(
  session({
    name: "sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === "production",              
      sameSite: NODE_ENV === "production" ? "none" : "lax", // 🔥 FIXED
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize passport with sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) =>
  res.send("🚀 Auth API with JWT + sessions + cookies")
);

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "db_error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
