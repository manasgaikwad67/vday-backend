const { moodResponse } = require("../services/groqService");
const { getUserConfig } = require("../services/userService");

exports.analyze = async (req, res) => {
  try {
    const { mood, details } = req.body;
    const userId = req.userId || null;

    const validMoods = ["sad", "stressed", "happy", "angry", "anxious", "lonely", "loved"];
    if (!mood || !validMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid mood",
        validMoods,
      });
    }

    // Get user config for personalization
    const config = await getUserConfig(userId);
    const response = await moodResponse(mood, details, config);
    res.json({ success: true, mood, response });
  } catch (error) {
    console.error("Mood error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
