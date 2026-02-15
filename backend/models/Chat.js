const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    sessionId: { type: String, default: "default" },
    messages: [messageSchema],
  },
  { timestamps: true }
);

chatSchema.index({ userId: 1, sessionId: 1 });

module.exports = mongoose.model("Chat", chatSchema);
