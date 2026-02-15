const mongoose = require("mongoose");

const dailyMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    message: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
  },
  { timestamps: true }
);

dailyMessageSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("DailyMessage", dailyMessageSchema);
