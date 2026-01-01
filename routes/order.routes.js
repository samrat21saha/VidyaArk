// routes/order.routes.js
const router = require("express").Router();
const User = require("../models/user");
const Order = require("../models/order");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { adminCheck } = require("../middlewares/admin.middleware");

/* ================= PLACE ORDER ================= */
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { Order: items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of items) {
      const { bookId, quantity } = item;

      for (let i = 0; i < quantity; i++) {
        const order = new Order({
          user: userId,
          book: bookId,
          status: "Order Placed",
        });

        const saved = await order.save();

        await User.findByIdAndUpdate(userId, {
          $push: { orders: saved._id },
        });
      }

      await User.findByIdAndUpdate(userId, {
        $pull: { cart: bookId },
      });
    }

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error.message);
    res.status(500).json({ message: "Failed to place order" });
  }
});

/* ================= USER ORDER HISTORY ================= */
router.get("/get-order-history", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).populate({
    path: "orders",
    populate: { path: "book" },
  });

  res.status(200).json({ data: user.orders.reverse() });
});

/* ================= ADMIN ================= */
router.get(
  "/get-all-orders",
  authenticateToken,
  adminCheck,
  async (req, res) => {
    const orders = await Order.find()
      .populate("book")
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: orders });
  }
);

module.exports = router;
