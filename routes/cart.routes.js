const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("../middlewares/auth.middleware");

/* ======================================================
   ADD TO CART
   ====================================================== */
router.put("/add-to-cart/:bookId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const user = await User.findById(userId);

    if (user.cart.includes(bookId)) {
      return res.status(400).json({ message: "Book already in cart" });
    }

    user.cart.push(bookId);
    await user.save();

    return res.status(200).json({
      message: "Book added to cart successfully",
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return res.status(500).json({ message: "Failed to add to cart" });
  }
});

/* ======================================================
   REMOVE FROM CART
   ====================================================== */
router.put(
  "/remove-from-cart/:bookId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { bookId } = req.params;

      await User.findByIdAndUpdate(userId, {
        $pull: { cart: bookId },
      });

      return res.status(200).json({
        message: "Book removed from cart",
      });
    } catch (error) {
      console.error("REMOVE CART ERROR:", error);
      return res.status(500).json({ message: "Failed to remove from cart" });
    }
  }
);

/* ======================================================
   GET CART ITEMS
   ====================================================== */
router.get("/get-cart", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("cart");
    return res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch cart" });
  }
});

module.exports = router;
