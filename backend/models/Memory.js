const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, required: true },
    caption: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

memorySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("Memory", memorySchema);
