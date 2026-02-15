const jwt = require("jsonwebtoken");

/**
 * Verify admin OR creator tokens.
 * - Admin token ({ isAdmin: true }): req.admin = decoded, req.userId = null
 * - Creator token ({ userId, isCreator }): req.userId = userId, req.admin = null
 * Both are allowed to access admin routes. Controllers filter by req.userId when present.
 */
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.isAdmin) {
      // Pure admin — sees everything
      req.admin = decoded;
      req.userId = null;
      return next();
    }

    if (decoded.userId && decoded.isCreator) {
      // Creator — sees only their data
      req.userId = decoded.userId;
      req.admin = null;
      return next();
    }

    return res.status(403).json({ success: false, message: "Not authorized" });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/**
 * Verify entry token (partner or legacy).
 * Extracts userId if present in token (multi-user mode).
 */
const verifyEntry = (req, res, next) => {
  try {
    const token = req.headers["x-entry-token"];
    if (!token) {
      return res.status(401).json({ success: false, message: "Entry required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Extract userId if present (multi-user partner tokens have it)
    req.userId = decoded.userId || null;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid entry token" });
  }
};

const verifyCreator = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId || !decoded.isCreator) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { verifyAdmin, verifyEntry, verifyCreator };
