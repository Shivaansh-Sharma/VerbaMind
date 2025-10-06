// Verbamind/backend/routes/auth.js
import express from "express";
import passport from "passport";
import {
  signup,
  login,
  refresh,
  logout,
  googleCallbackHandler,
  me,
} from "../controllers/authController.js";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// Local auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Passport Google - START the OAuth flow
// This will redirect the browser to Google for login/consent
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true, // we use sessions in your app
  })
);

// Callback after Google has authenticated the user
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
    session: true,
  }),
  googleCallbackHandler
);

router.get("/google/failure", (req, res) =>
  res.status(401).json({ message: "Google auth failed" })
);

// test endpoint returning session user
router.get("/me", me);

// Protected API example (requires access token)
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You reached protected resource", user: req.user });
});

export default router;
