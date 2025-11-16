// backend/utils/authMiddleware.js
import jwt from "jsonwebtoken";

/**
 * Middleware to check accessToken cookie first, then Authorization: Bearer <token> header.
 */
export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  const bearerToken =
    header && header.startsWith("Bearer ")
      ? header.split(" ")[1]
      : null;

  // ✅ Prefer cookie token, fallback to header token
  const token = req.cookies?.accessToken || bearerToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
