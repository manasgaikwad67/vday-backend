const mongoose = require("mongoose");

const letterSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    style: {
      type: String,
      enum: ["romantic", "funny", "emotional", "bollywood", "future-husband", "comfort"],
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

letterSchema.index({ userId: 1 });

module.exports = mongoose.model("Letter", letterSchema);
