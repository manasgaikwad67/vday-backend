const router = require("express").Router();
const { verifyAdmin } = require("../middleware/auth");
const { getDashboard, getChatLogs, getLetters, getSecret, clearChats } = require("../controllers/adminController");

router.get("/dashboard", verifyAdmin, getDashboard);
router.get("/chats", verifyAdmin, getChatLogs);
router.get("/letters", verifyAdmin, getLetters);
router.get("/secret", verifyAdmin, getSecret);
router.delete("/chats", verifyAdmin, clearChats);

module.exports = router;
