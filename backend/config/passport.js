// backend/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

import { findUserByEmail, createUser, findUserById } from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const GOOGLE_CALLBACK = `${BACKEND_URL}/auth/google/callback`;

// Serialize/deserialize for session support
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name =
          profile.displayName ||
          [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(" ") ||
          "Google User";

        if (!email) {
          return done(new Error("No email from Google"), null);
        }

        let user = await findUserByEmail(email);

        if (!user) {
          // Generate a random password and store hashed value (so password column is NOT NULL)
          const randomPassword = crypto.randomBytes(48).toString("hex");
          const hashed = await bcrypt.hash(randomPassword, 10);
          user = await createUser(name, email, hashed);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
