const User = require("../models/user");

const adminCheck = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

module.exports = { adminCheck };
