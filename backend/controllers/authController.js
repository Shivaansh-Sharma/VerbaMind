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
import {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserName,
    updateUserPassword,
} from "../models/User.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV || "development";

/** OTP via EmailJS REST API */
async function sendSignupOtpEmail(to, otp) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY; // optional but used if strict mode is on

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      "EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID or EMAILJS_PUBLIC_KEY env vars are not set"
    );
  }

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey, // ✅ EmailJS expects PUBLIC key here
    template_params: {
      email: to, // must match your EmailJS template variable name
      passcode: otp,          // must match {{otp}} in the template
    },
  };

  // If "Use Private Key" / strict mode is enabled, include it:
  if (privateKey) {
    payload.accessToken = privateKey; // ✅ PRIVATE key goes here
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("EmailJS send error:", response.status, errorText);
    throw new Error("Failed to send OTP email");
  }

  console.log("EmailJS OTP email sent to:", to);
}

// Helper: set refresh token cookie
const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper: clear auth cookies
const clearAuthCookies = (res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
};

/**
 * Signup (direct, without OTP – still available if you want)
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });

    const existing = await findUserByEmail(email);
    if (existing)
      return res.status(409).json({ message: "User already exists" });

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
      sameSite: "None",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ accessToken, user: payloadUser });
  } catch (err) {
    console.error("Signup error:", err.stack || err);
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
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const q = await pool.query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [email]
    );
    const user = q.rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched)
      return res.status(401).json({ message: "Invalid credentials" });

    const payloadUser = { id: user.id, email: user.email, name: user.name };

    req.session.regenerate(async (err) => {
      if (err) return res.status(500).json({ message: "Session error" });

      req.login(payloadUser, async (err2) => {
        if (err2)
          return res.status(500).json({ message: "Session login error" });

        const accessToken = generateAccessToken(payloadUser);
        const refreshToken = generateRefreshToken(payloadUser);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await createRefreshTokenModel(user.id, refreshToken, expiresAt);

        setRefreshCookie(res, refreshToken);
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: NODE_ENV === "production",
          sameSite: "None",
          maxAge: 15 * 60 * 1000,
        });

        res.json({ accessToken, user: payloadUser });
      });
    });
  } catch (err) {
    console.error("Login error:", err.stack || err);
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
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.redirect(FRONTEND_URL + "/dashboard");
  } catch (err) {
    console.error("Google callback error:", err.stack || err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Refresh access token
 */
export const refresh = async (req, res) => {
  try {
    const candidate = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!candidate)
      return res.status(401).json({ message: "Missing refresh token" });

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

    if (!matched)
      return res.status(401).json({ message: "Invalid refresh token" });

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
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    console.error("Refresh error:", err.stack || err);
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
      const tokensQ = await pool.query(
        "SELECT id, token_hash, user_id FROM refresh_tokens WHERE revoked = false"
      );
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
    console.error("Logout error:", err.stack || err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * /me route
 */
export const me = (req, res) => {
  if (req.user) return res.json({ user: req.user, session: true });

  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[1]);
  if (!token) return res.json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ user: decoded, session: false });
  } catch {
    return res.json({ user: null });
  }
};

/**
 * Edit Name
 */
export const updateName = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const trimmedName = name.trim();
    const updatedUser = await updateUserName(userId, trimmedName);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const payloadUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    };

    const accessToken = generateAccessToken(payloadUser);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      user: updatedUser,
      accessToken,
      message: "Name updated successfully",
    });
  } catch (err) {
    console.error("Error updating name:", err);
    return res.status(500).json({ error: "Failed to update name" });
  }
};

/**
 * OTP Signup (Session-based)
 */

// Step 1: user submits name/email/password -> send OTP
export const signupRequestOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    if (!trimmedName) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingUser = await findUserByEmail(trimmedEmail);
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // store in session
    req.session.signupOtp = otp;
    req.session.signupData = {
      name: trimmedName,
      email: trimmedEmail,
      hashedPassword,
    };

    // send OTP via EmailJS
    await sendSignupOtpEmail(trimmedEmail, otp);

    console.log("Signup OTP created for", trimmedEmail, "otp:", otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Error in signupRequestOtp:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Step 2: user submits email + OTP -> create user and log them in
export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    if (!req.session.signupOtp || !req.session.signupData) {
      return res.status(400).json({ error: "No OTP session found" });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const otpString = String(otp).trim();

    if (req.session.signupData.email !== trimmedEmail) {
      return res.status(400).json({ error: "Email mismatch" });
    }

    if (req.session.signupOtp !== otpString) {
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    const { name, hashedPassword } = req.session.signupData;

    // check again if user exists (race condition safety)
    let user = await findUserByEmail(trimmedEmail);
    if (!user) {
      user = await createUser(name, trimmedEmail, hashedPassword);
    }

    // clear session OTP data
    req.session.signupOtp = null;
    req.session.signupData = null;

    if (!user) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    // Issue tokens (same pattern as login / signup)
    const payloadUser = { id: user.id, email: user.email, name: user.name };
    const accessToken = generateAccessToken(payloadUser);
    const refreshToken = generateRefreshToken(payloadUser);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const storedRefresh = await createRefreshTokenModel(
      user.id,
      refreshToken,
      refreshExpiresAt
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshTokenId", storedRefresh.id, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: payloadUser,
      accessToken,
      message: "Signup successful",
    });
  } catch (err) {
    console.error("Error in verifySignupOtp:", err);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};

// STEP 1: logged-in user requests OTP for password reset
export const requestPasswordResetOtp = async (req, res) => {
  try {
    // req.user is set by authMiddleware (JWT)
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // store minimal info in session for reset flow
    req.session.passwordReset = {
      otp,
      userId: user.id,
      email: user.email,
      createdAt: Date.now(),
    };

    // send OTP via EmailJS (same as signup)
    await sendSignupOtpEmail(user.email, otp);

    console.log("Password reset OTP created for", user.email, "otp:", otp);

    return res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Error in requestPasswordResetOtp:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

// STEP 2: user submits OTP -> verify only
export const verifyPasswordResetOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ error: "OTP is required" });
    }

    const otpString = String(otp).trim();

    const sessionData = req.session.passwordReset;
    if (!sessionData) {
      return res.status(400).json({ error: "No password reset request found" });
    }

    // Optional: 10 minutes expiry
    const TEN_MINUTES = 10 * 60 * 1000;
    if (Date.now() - sessionData.createdAt > TEN_MINUTES) {
      delete req.session.passwordReset;
      return res.status(400).json({ error: "OTP has expired. Please request again." });
    }

    if (sessionData.otp !== otpString) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Mark OTP as verified in session
    req.session.passwordResetVerified = true;

    return res.json({ message: "OTP verified. You can now set a new password." });
  } catch (err) {
    console.error("Error in verifyPasswordResetOtp:", err);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};

// STEP 3: user sends new password + confirm -> update password
export const updatePasswordAfterOtp = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: "New password and confirm password are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const sessionData = req.session.passwordReset;
    if (!sessionData || !req.session.passwordResetVerified) {
      return res
        .status(400)
        .json({ error: "OTP verification is required before changing password" });
    }

    const userId = sessionData.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(userId, hashedPassword);

    // Clean up session data
    delete req.session.passwordReset;
    delete req.session.passwordResetVerified;

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error in updatePasswordAfterOtp:", err);
    return res.status(500).json({ error: "Failed to update password" });
  }
};
