const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("../middlewares/auth.middleware");

/* ======================================================
   ADD TO FAVOURITES
   ====================================================== */
router.put(
  "/add-book-to-favourite/:bookId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { bookId } = req.params;

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const user = await User.findById(userId);

      if (user.favourites.includes(bookId)) {
        return res.status(400).json({ message: "Already in favourites" });
      }

      user.favourites.push(bookId);
      await user.save();

      return res.status(200).json({
        message: "Book added to favourites",
      });
    } catch (error) {
      console.error("ADD FAV ERROR:", error);
      return res.status(500).json({ message: "Failed to add favourite" });
    }
  }
);

/* ======================================================
   REMOVE FROM FAVOURITES
   ====================================================== */
router.put(
  "/remove-book-from-favourite/:bookId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { bookId } = req.params;

      await User.findByIdAndUpdate(userId, {
        $pull: { favourites: bookId },
      });

      return res.status(200).json({
        message: "Book removed from favourites",
      });
    } catch (error) {
      console.error("REMOVE FAV ERROR:", error);
      return res.status(500).json({ message: "Failed to remove favourite" });
    }
  }
);

/* ======================================================
   GET FAVOURITE BOOKS
   ====================================================== */
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("favourites");
    return res.status(200).json({
      favourites: user.favourites,
    });
  } catch (error) {
    console.error("GET FAV ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch favourites" });
  }
});

module.exports = router;
