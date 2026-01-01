const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("../middlewares/auth.middleware");

/* ================= TOGGLE FAVOURITE ================= */
router.put("/toggle-favourite/:bookId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const user = await User.findById(userId);

    const alreadyFav = user.favourites.some(
      (id) => id.toString() === bookId
    );

    if (alreadyFav) {
      user.favourites = user.favourites.filter(
        (id) => id.toString() !== bookId
      );
    } else {
      user.favourites.push(book._id);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      isFavourite: !alreadyFav,
    });
  } catch (err) {
    console.error("FAV TOGGLE ERROR:", err);
    res.status(500).json({ message: "Favourite toggle failed" });
  }
});

/* ================= GET FAVOURITES ================= */
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("favourites");
    res.status(200).json({ favourites: user.favourites || [] });
  } catch (err) {
    console.error("GET FAV ERROR:", err);
    res.status(500).json({ message: "Failed to fetch favourites" });
  }
});

module.exports = router;
