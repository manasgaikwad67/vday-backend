const Chat = require("../models/Chat");
const { boyfriendChat } = require("../services/groqService");
const { getUserConfig } = require("../services/userService");

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    const userId = req.userId || null;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Get or create conversation (scoped by userId)
    const query = userId ? { userId, sessionId } : { userId: null, sessionId };
    let chat = await Chat.findOne(query);
    if (!chat) {
      chat = new Chat({ userId, sessionId, messages: [] });
    }

    // Build conversation history for context
    const history = chat.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Get user config for AI personalization
    const config = await getUserConfig(userId);

    // Get AI response
    const rawReply = await boyfriendChat(history, message.trim(), config);

    // Split into multiple message bubbles (Manas sends bursts of short texts)
    const bubbles = rawReply
      .replace(/\\n/g, "\n")
      .split(/\n?\s*---\s*\n?/)
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    // Save user message
    chat.messages.push({ role: "user", content: message.trim() });

    // Save each bubble as a separate assistant message
    for (const bubble of bubbles) {
      chat.messages.push({ role: "assistant", content: bubble });
    }
    await chat.save();

    res.json({ success: true, reply: rawReply, bubbles });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { sessionId = "default" } = req.params;
    const userId = req.userId || null;
    const query = userId ? { userId, sessionId } : { userId: null, sessionId };
    const chat = await Chat.findOne(query);
    res.json({ success: true, messages: chat?.messages || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    const { sessionId = "default" } = req.params;
    const userId = req.userId || null;
    const query = userId ? { userId, sessionId } : { userId: null, sessionId };
    await Chat.findOneAndDelete(query);
    res.json({ success: true, message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
