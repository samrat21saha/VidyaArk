const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const upload = require("../middlewares/upload.middleware");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middlewares/auth.middleware");

// ---------------- SIGN UP ----------------
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if (username.length < 4) {
      return res.status(400).json({
        message: "Username length should be greater than 3",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "This Username already exist",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exist",
      });
    }

    // ❌ REMOVED PASSWORD LENGTH BLOCK
    // Weak passwords are allowed (frontend already warns user)

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashPass,
      address,
    });

    await newUser.save();

    return res.status(200).json({
      message: "SignUp Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
});

// ---------------- SIGN IN ----------------
router.post("/sign-in", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "Signed in successfully",
      userId: user._id,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ---------------- USER DETAILS ----------------
router.get("/user-details", authenticateToken, async (req, res) => {
  try {
    const data = await User.findById(req.user.userId).select("-password");
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* ================= UPDATE AVATAR ================= */
router.put(
  "/update-avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const avatarPath = `/uploads/avatars/${req.file.filename}`;

      await User.findByIdAndUpdate(req.user.userId, {
        avatar: avatarPath,
      });

      return res.status(200).json({
        message: "Avatar updated successfully",
        avatar: avatarPath,
      });
    } catch (error) {
      return res.status(500).json({ message: "Avatar update failed" });
    }
  }
);

module.exports = router;
