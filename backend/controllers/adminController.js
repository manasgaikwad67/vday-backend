const Chat = require("../models/Chat");
const Letter = require("../models/Letter");
const Memory = require("../models/Memory");
const Visitor = require("../models/Visitor");
const DailyMessage = require("../models/DailyMessage");
const Secret = require("../models/Secret");

/**
 * Build a filter query.
 * - If req.userId is set (creator token): scope to that user.
 * - If req.userId is null (admin token): return all data.
 */
function buildFilter(req) {
  return req.userId ? { userId: req.userId } : {};
}

exports.getDashboard = async (req, res) => {
  try {
    const filter = buildFilter(req);
    const [chatCount, letterCount, memoryCount, visitor, dailyCount] = await Promise.all([
      Chat.countDocuments(filter),
      Letter.countDocuments(filter),
      Memory.countDocuments(filter),
      req.userId ? Visitor.findOne({ userId: req.userId }) : Visitor.aggregate([{ $group: { _id: null, total: { $sum: "$count" } } }]),
      DailyMessage.countDocuments(filter),
    ]);

    const visitorCount = req.userId
      ? (visitor?.count || 0)
      : (Array.isArray(visitor) && visitor[0]?.total) || 0;

    res.json({
      success: true,
      dashboard: {
        totalChats: chatCount,
        totalLetters: letterCount,
        totalMemories: memoryCount,
        visitorCount,
        lastVisit: req.userId ? (visitor?.lastVisit || null) : null,
        totalDailyMessages: dailyCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatLogs = async (req, res) => {
  try {
    const filter = buildFilter(req);
    const chats = await Chat.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLetters = async (req, res) => {
  try {
    const filter = buildFilter(req);
    const letters = await Letter.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, letters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSecret = async (req, res) => {
  try {
    const filter = buildFilter(req);
    const secret = await Secret.findOne(filter);
    res.json({ success: true, secret });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.clearChats = async (req, res) => {
  try {
    const filter = buildFilter(req);
    const result = await Chat.deleteMany(filter);
    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} chat session(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
