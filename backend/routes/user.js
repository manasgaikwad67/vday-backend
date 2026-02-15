const router = require("express").Router();
const { verifyCreator } = require("../middleware/auth");
const {
  register,
  login,
  partnerEntry,
  getProfile,
  updateProfile,
  checkSlug,
  getBySlug,
} = require("../controllers/userController");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/partner-entry", partnerEntry);
router.get("/check-slug/:slug", checkSlug);
router.get("/page/:slug", getBySlug);

// Protected routes (for creators)
router.get("/profile", verifyCreator, getProfile);
router.put("/profile", verifyCreator, updateProfile);

module.exports = router;
