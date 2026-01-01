const router = require("express").Router();
const User = require("../models/user");
const Order = require("../models/order");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { adminCheck } = require("../middlewares/admin.middleware");

/* ======================================================
   PLACE ORDER (USER)
   ====================================================== */
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { Order: cartBooks } = req.body;

    if (!cartBooks || cartBooks.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const book of cartBooks) {
      const newOrder = new Order({
        user: userId,
        book: book._id,
        status: "Order Placed",
      });

      const savedOrder = await newOrder.save();

      await User.findByIdAndUpdate(userId, {
        $push: { orders: savedOrder._id },
        $pull: { cart: book._id },
      });
    }

    return res.status(200).json({
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    return res.status(500).json({ message: "Failed to place order" });
  }
});

/* ======================================================
   USER ORDER HISTORY
   ====================================================== */
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate({
      path: "orders",
      populate: { path: "book" },
    });

    return res.status(200).json({
      data: user.orders.reverse(),
    });
  } catch (error) {
    console.error("ORDER HISTORY ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ======================================================
   CANCEL ORDER (USER)
   ====================================================== */
router.put("/cancel-order/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    if (["Delivered", "Canceled", "Returned"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Order cannot be canceled" });
    }

    order.status = "Canceled";
    await order.save();

    return res.status(200).json({ message: "Order canceled successfully" });
  } catch (error) {
    console.error("CANCEL ERROR:", error);
    return res.status(500).json({ message: "Cancel failed" });
  }
});

/* ======================================================
   RETURN ORDER (USER)
   ====================================================== */
router.put("/return-order/:orderId", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    const diffDays =
      (Date.now() - new Date(order.updatedAt)) / (1000 * 60 * 60 * 24);

    if (order.status !== "Delivered" || diffDays > 7) {
      return res
        .status(400)
        .json({ message: "Return window expired" });
    }

    order.status = "Returned";
    await order.save();

    return res.status(200).json({ message: "Order returned successfully" });
  } catch (error) {
    console.error("RETURN ERROR:", error);
    return res.status(500).json({ message: "Return failed" });
  }
});

/* ======================================================
   GET ALL ORDERS (ADMIN)
   ====================================================== */
router.get(
  "/get-all-orders",
  authenticateToken,
  adminCheck,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("book")
        .populate("user", "username email address avatar")
        .sort({ createdAt: -1 });

      return res.status(200).json({ data: orders });
    } catch (error) {
      console.error("ADMIN ORDERS ERROR:", error);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }
  }
);

/* ======================================================
   UPDATE ORDER STATUS (ADMIN)
   ====================================================== */
router.put(
  "/update-status/:orderId",
  authenticateToken,
  adminCheck,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowed = [
        "Order Placed",
        "Out for delivery",
        "Delivered",
        "Canceled",
        "Returned",
      ];

      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updated = await Order.findByIdAndUpdate(
        req.params.orderId,
        { status },
        { new: true }
      );

      if (!updated)
        return res.status(404).json({ message: "Order not found" });

      return res.status(200).json({
        message: "Order status updated",
        data: updated,
      });
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
      return res.status(500).json({ message: "Update failed" });
    }
  }
);

module.exports = router;
