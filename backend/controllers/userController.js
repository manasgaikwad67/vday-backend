const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Secret = require("../models/Secret");
const Visitor = require("../models/Visitor");

// Register new creator account
exports.register = async (req, res) => {
  try {
    const { email, password, slug, partnerPassword, creatorName, partnerName, relationshipStartDate } = req.body;

    // Validate required fields
    if (!email || !password || !partnerPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and partner password are required",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate unique slug
    let finalSlug = slug;
    if (!finalSlug) {
      // Generate from creator name or email
      const baseName = creatorName || email.split("@")[0];
      finalSlug = await User.generateSlug(baseName);
    } else {
      // Check if custom slug is available
      finalSlug = finalSlug.toLowerCase().replace(/[^a-z0-9]/g, "");
      const existingSlug = await User.findOne({ slug: finalSlug });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: "This URL is already taken. Please choose another.",
        });
      }
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      slug: finalSlug,
      partnerPassword,
      creatorName: creatorName || "Your Love",
      partnerName: partnerName || "My Love",
      relationshipStartDate: relationshipStartDate ? new Date(relationshipStartDate) : new Date(),
    });

    // Create default secret game for this user
    await Secret.create({
      userId: user._id,
      questions: [
        { question: "Where did we first meet?", answer: "change this" },
        { question: "What is my favorite thing about you?", answer: "change this" },
        { question: "What movie did we watch on our first date?", answer: "change this" },
      ],
      secretMessage: "I love you more than words can express! 💕",
      videoUrl: "",
      isActive: true,
    });

    // Create visitor counter for this user
    await Visitor.create({
      userId: user._id,
      count: 0,
    });

    // Generate token
    const token = jwt.sign(
      { userId: user._id, isCreator: true },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        email: user.email,
        slug: user.slug,
        creatorName: user.creatorName,
        partnerName: user.partnerName,
        relationshipStartDate: user.relationshipStartDate,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Creator login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, isCreator: true },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        slug: user.slug,
        creatorName: user.creatorName,
        partnerName: user.partnerName,
        relationshipStartDate: user.relationshipStartDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Partner entry (by slug and password)
exports.partnerEntry = async (req, res) => {
  try {
    const { slug, password } = req.body;

    if (!slug || !password) {
      return res.status(400).json({
        success: false,
        message: "Link and password are required",
      });
    }

    const user = await User.findOne({ slug: slug.toLowerCase(), isActive: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "This love page doesn't exist 💔",
      });
    }

    if (password !== user.partnerPassword) {
      return res.status(401).json({
        success: false,
        message: "Wrong password, my love 💔",
      });
    }

    // Increment visitor count
    await Visitor.findOneAndUpdate(
      { userId: user._id },
      { $inc: { count: 1 }, lastVisit: new Date() },
      { upsert: true }
    );

    const token = jwt.sign(
      { userId: user._id, isPartner: true },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      config: {
        herName: user.partnerName,
        myName: user.creatorName,
        relationshipStart: user.relationshipStartDate,
        slug: user.slug,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user profile (for creators)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        slug: user.slug,
        creatorName: user.creatorName,
        partnerName: user.partnerName,
        relationshipStartDate: user.relationshipStartDate,
        partnerPassword: user.partnerPassword,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { creatorName, partnerName, relationshipStartDate, partnerPassword } = req.body;

    const updates = {};
    if (creatorName) updates.creatorName = creatorName;
    if (partnerName) updates.partnerName = partnerName;
    if (relationshipStartDate) updates.relationshipStartDate = new Date(relationshipStartDate);
    if (partnerPassword) updates.partnerPassword = partnerPassword;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select("-password");

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        slug: user.slug,
        creatorName: user.creatorName,
        partnerName: user.partnerName,
        relationshipStartDate: user.relationshipStartDate,
        partnerPassword: user.partnerPassword,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if slug is available
exports.checkSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    const existing = await User.findOne({ slug: cleanSlug });
    
    res.json({
      success: true,
      available: !existing,
      slug: cleanSlug,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get public user info by slug (for partner entry page)
exports.getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const user = await User.findOne({ slug: slug.toLowerCase(), isActive: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "This love page doesn't exist",
      });
    }

    res.json({
      success: true,
      page: {
        partnerName: user.partnerName,
        creatorName: user.creatorName,
        exists: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
