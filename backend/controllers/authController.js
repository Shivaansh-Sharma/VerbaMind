// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import {
  createRefreshToken as createRefreshTokenModel,
  revokeRefreshTokenById,
  revokeAllRefreshTokensForUser,
  verifyRefreshTokenHash,
} from "../models/RefreshToken.js";
import { findUserByEmail, createUser, findUserById } from "../models/User.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV || "development";

// Helper: set refresh token cookie
const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper: clear auth cookies
const clearAuthCookies = (res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
};

/**
 * Signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, and password are required" });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashed);

    const payloadUser = { id: user.id, email: user.email, name: user.name };
    const accessToken = generateAccessToken(payloadUser);
    const refreshToken = generateRefreshToken(payloadUser);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await createRefreshTokenModel(user.id, refreshToken, expiresAt);

    // set cookies
    setRefreshCookie(res, refreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ accessToken, user: payloadUser });
  } catch (err) {
    console.error("Signup error:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const q = await pool.query("SELECT id, name, email, password FROM users WHERE email = $1", [email]);
    const user = q.rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(401).json({ message: "Invalid credentials" });

    const payloadUser = { id: user.id, email: user.email, name: user.name };

    req.session.regenerate(async (err) => {
      if (err) return res.status(500).json({ message: "Session error" });

      req.login(payloadUser, async (err2) => {
        if (err2) return res.status(500).json({ message: "Session login error" });

        const accessToken = generateAccessToken(payloadUser);
        const refreshToken = generateRefreshToken(payloadUser);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await createRefreshTokenModel(user.id, refreshToken, expiresAt);

        setRefreshCookie(res, refreshToken);
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: NODE_ENV === "production",
          sameSite: "none",
          maxAge: 15 * 60 * 1000,
        });

        res.json({ accessToken, user: payloadUser });
      });
    });
  } catch (err) {
    console.error("Login error:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Google OAuth Start (passport middleware handles redirect)
 */
export const googleAuthStart = (req, res, next) => next();

/**
 * Google OAuth callback
 */
export const googleCallbackHandler = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "No user from Google" });

    const payloadUser = { id: user.id, email: user.email, name: user.name };
    const accessToken = generateAccessToken(payloadUser);
    const refreshToken = generateRefreshToken(payloadUser);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await createRefreshTokenModel(user.id, refreshToken, expiresAt);

    setRefreshCookie(res, refreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

res.redirect(FRONTEND_URL + "/dashboard");
  } catch (err) {
    console.error("Google callback error:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Refresh access token
 */
export const refresh = async (req, res) => {
  try {
    const candidate = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!candidate) return res.status(401).json({ message: "Missing refresh token" });

    const tokensQ = await pool.query(
      "SELECT id, user_id, token_hash, expires_at, revoked FROM refresh_tokens WHERE revoked = false"
    );

    let matched = null;
    for (const row of tokensQ.rows) {
      if (row.expires_at && new Date(row.expires_at) < new Date()) continue;
      if (await verifyRefreshTokenHash(row.token_hash, candidate)) {
        matched = row;
        break;
      }
    }

    if (!matched) return res.status(401).json({ message: "Invalid refresh token" });

    const user = await findUserById(matched.user_id);
    if (!user) return res.status(401).json({ message: "User not found" });

    await revokeRefreshTokenById(matched.id);

    const payloadUser = { id: user.id, email: user.email, name: user.name };
    const accessToken = generateAccessToken(payloadUser);
    const newRefreshToken = generateRefreshToken(payloadUser);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await createRefreshTokenModel(user.id, newRefreshToken, expiresAt);

    setRefreshCookie(res, newRefreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    console.error("Refresh error:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Logout
 */
export const logout = async (req, res) => {
  try {
    const candidate = req.cookies?.refreshToken || req.body?.refreshToken;

    if (candidate) {
      const tokensQ = await pool.query("SELECT id, token_hash, user_id FROM refresh_tokens WHERE revoked = false");
      for (const row of tokensQ.rows) {
        if (await verifyRefreshTokenHash(row.token_hash, candidate)) {
          await revokeAllRefreshTokensForUser(row.user_id);
          break;
        }
      }
    }

    req.logout((err) => {
      if (err) console.error("Logout error:", err);
      req.session.destroy((err2) => {
        if (err2) console.error("Session destroy error:", err2);
        clearAuthCookies(res);
        res.json({ message: "Logged out" });
      });
    });
  } catch (err) {
    console.error("Logout error:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * /me route
 */
export const me = (req, res) => {
  if (req.user) return res.json({ user: req.user, session: true });

  const token = req.cookies?.accessToken || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) return res.json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ user: decoded, session: false });
  } catch {
    return res.json({ user: null });
  }
};
