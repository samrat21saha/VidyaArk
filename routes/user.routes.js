const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
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

    if (password.length < 7) {
      return res.status(400).json({
        message: "Password length should be greater than 6",
      });
    }

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
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ---------------- UPDATE ADDRESS ----------------
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { address } = req.body;

    await User.findByIdAndUpdate(req.user.userId, { address });

    return res.status(200).json({
      message: "Address updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Address Update failed",
    });
  }
});

// ---------------- UPDATE PASSWORD ----------------
router.put("/update-password", authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.user.userId, {
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Password Update failed",
    });
  }
});

// ---------------- UPDATE USERNAME ----------------
router.put("/update-username", authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;

    await User.findByIdAndUpdate(req.user.userId, { username });

    return res.status(200).json({
      message: "Username updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Username Update failed",
    });
  }
});

module.exports = router;
