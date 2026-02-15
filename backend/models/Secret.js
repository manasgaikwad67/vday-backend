const mongoose = require("mongoose");

const secretSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }, // stored lowercase for comparison
      },
    ],
    secretMessage: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Secret", secretSchema);
