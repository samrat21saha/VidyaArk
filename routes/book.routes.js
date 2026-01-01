// book.routes.js
const router = require("express").Router();
const Book = require("../models/book");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { adminCheck } = require("../middlewares/admin.middleware");

/* ======================================================
   ADD BOOK (ADMIN)
====================================================== */
router.post("/add-book", authenticateToken, adminCheck, async (req, res) => {
  try {
    const book = new Book({
      pdfUrl: req.body.pdfUrl,
      coverImageUrl: req.body.coverImageUrl,
      title: req.body.title,
      author: req.body.author,
      pages: req.body.pages,
      printPrice: req.body.printPrice,
      category: req.body.category,
      desc: req.body.desc,
      lang: req.body.lang,
    });

    await book.save();

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
    });
  } catch (error) {
    console.error("Add book error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/* ======================================================
   UPDATE BOOK (ADMIN)
====================================================== */
router.put(
  "/update-book/:bookid",
  authenticateToken,
  adminCheck,
  async (req, res) => {
    try {
      const { bookid } = req.params;

      const updatedBook = await Book.findByIdAndUpdate(
        bookid,
        {
          pdfUrl: req.body.pdfUrl,
          coverImageUrl: req.body.coverImageUrl,
          title: req.body.title,
          author: req.body.author,
          pages: req.body.pages,
          printPrice: req.body.printPrice,
          category: req.body.category,
          desc: req.body.desc,
          lang: req.body.lang,
        },
        { new: true }
      );

      if (!updatedBook) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Book updated successfully",
      });
    } catch (error) {
      console.error("Update book error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

/* ======================================================
   DELETE BOOK (ADMIN)
====================================================== */
router.delete(
  "/delete-book/:bookid",
  authenticateToken,
  adminCheck,
  async (req, res) => {
    try {
      const { bookid } = req.params;

      const deletedBook = await Book.findByIdAndDelete(bookid);

      if (!deletedBook) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      console.error("Delete book error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

/* ======================================================
   GET ALL BOOKS (PUBLIC)
====================================================== */
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      books: books,
    });
  } catch (error) {
    console.error("Get all books error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/* ======================================================
   GET RECENT BOOKS (PUBLIC — LAST 5)
====================================================== */
router.get("/recent-books", async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1, _id: -1 }) // 🔥 fallback to _id timestamp
      .limit(5);

    return res.status(200).json({
      success: true,
      count: books.length,
      book: books,
    });
  } catch (error) {
    console.error("Recent books error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


/* ======================================================
   GET BOOK DETAILS (PUBLIC)
====================================================== */
router.get("/book-details/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid book id",
    });
  }
});

module.exports = router;
