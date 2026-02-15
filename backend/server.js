require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");
const { globalLimiter } = require("./middleware/rateLimit");
const cronJob = require("./cron/dailyCron");

const app = express();

// ── Security & Parsing ──────────────────────────────────────────
app.use(helmet());

// CORS configuration for production
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all for now, tighten in production if needed
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(globalLimiter);

// ── Static uploads ──────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ──────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/user",     require("./routes/user"));
app.use("/api/chat",     require("./routes/chat"));
app.use("/api/letter",   require("./routes/letter"));
app.use("/api/memory",   require("./routes/memory"));
app.use("/api/mood",     require("./routes/mood"));
app.use("/api/future",   require("./routes/future"));
app.use("/api/secret",   require("./routes/secret"));
app.use("/api/daily",    require("./routes/daily"));
app.use("/api/admin",    require("./routes/admin"));

// ── Health check ────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "alive", timestamp: new Date().toISOString() });
});

// ── Error handler ───────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ── Start ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  // Drop stale unique indexes from old schema versions
  try {
    const mongoose = require("mongoose");
    const collectionsToClean = [
      { name: "users", staleKeys: ["coupleCode"] },
      { name: "secrets", staleKeys: ["userId"] },
      { name: "visitors", staleKeys: ["userId"] },
      { name: "dailymessages", staleKeys: ["date"] },
    ];

    for (const { name, staleKeys } of collectionsToClean) {
      try {
        const col = mongoose.connection.db.collection(name);
        const indexes = await col.indexes();
        for (const idx of indexes) {
          if (idx.name === "_id_") continue;
          const hasStaleKey = staleKeys.some((k) => idx.key && idx.key[k] !== undefined);
          if (hasStaleKey && idx.unique) {
            await col.dropIndex(idx.name);
            console.log(`🗑️  Dropped stale index: ${name}.${idx.name}`);
          }
        }
      } catch {}
    }
  } catch (e) {
    // Ignore if collections don't exist
  }

  // Migrate orphaned documents (created before multi-user) to the first user
  try {
    const User = require("./models/User");
    const users = await User.find().sort({ createdAt: 1 }).limit(1).lean();
    if (users.length === 1) {
      const ownerId = users[0]._id;
      const collectionsToMigrate = ["chats", "letters", "memories", "dailymessages"];
      for (const name of collectionsToMigrate) {
        try {
          const col = mongoose.connection.db.collection(name);
          const result = await col.updateMany(
            { $or: [{ userId: null }, { userId: { $exists: false } }] },
            { $set: { userId: ownerId } }
          );
          if (result.modifiedCount > 0) {
            console.log(`🔄  Migrated ${result.modifiedCount} orphaned docs in ${name} → user ${ownerId}`);
          }
        } catch {}
      }
    }
  } catch (e) {
    // Migration is optional; don't block startup
  }

  app.listen(PORT, () => {
    console.log(`💕  Server running on port ${PORT}`);
    cronJob.start();
    console.log("📅  Daily message cron job started");
  });
});
