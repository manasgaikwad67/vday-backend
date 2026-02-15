const Letter = require("../models/Letter");
const { generateLetter } = require("../services/groqService");
const { getUserConfig } = require("../services/userService");

exports.generate = async (req, res) => {
  try {
    const { style = "romantic" } = req.body;
    const userId = req.userId || null;

    const validStyles = ["romantic", "funny", "emotional", "bollywood", "future-husband", "comfort"];
    if (!validStyles.includes(style)) {
      return res.status(400).json({ success: false, message: "Invalid letter style" });
    }

    // Get user config for personalization
    const config = await getUserConfig(userId);
    const content = await generateLetter(style, config);

    // Save to database (scoped by userId)
    const letter = await Letter.create({ userId, style, content });

    res.json({ success: true, letter });
  } catch (error) {
    console.error("Letter error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const userId = req.userId || null;
    const query = userId ? { userId } : { userId: null };
    const letters = await Letter.find(query).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, letters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const userId = req.userId || null;
    const filter = userId ? { _id: req.params.id, userId } : { _id: req.params.id };
    const letter = await Letter.findOne(filter);
    if (!letter) {
      return res.status(404).json({ success: false, message: "Letter not found" });
    }
    res.json({ success: true, letter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const userId = req.userId || null;
    const filter = userId ? { _id: req.params.id, userId } : { _id: req.params.id };
    await Letter.findOneAndDelete(filter);
    res.json({ success: true, message: "Letter deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
