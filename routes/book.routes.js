const router = require("express").Router();
const Book = require("../models/book");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { adminCheck } = require("../middlewares/admin.middleware");

// At first check at once the user is authenticated or not and user has admin role or not
// router.use(authenticateToken, adminCheck);


// middleware check are also valid like this
// router.post("/add-book",authenticateToken, adminCheck, async (req, res) => {...}  )

// add book
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

    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// update book
router.put("/update-book/:bookid", authenticateToken, adminCheck, async (req, res) => {
  try {
    const { bookid } = req.params;

    await Book.findByIdAndUpdate(
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

    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// delete book
router.delete("/delete-book",authenticateToken, adminCheck, async (req, res) => {
    try {
        const { bookid } = req.headers;

        await Book.findByIdAndDelete(bookid);
        res.status(200).json({ message: "Book Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// get all books (public)
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: books.length,
            books: books,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// get recent books (limit 5)
router.get("/recent-books", async (req, res) => {
    try {
        const books = await Book.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            count: books.length,
            books: books,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// get single book by id (public)
router.get("/book-details/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(book);
    } catch (error) {
        // handles invalid ObjectId format
        res.status(400).json({ message: "Invalid book id" });
    }
});



module.exports = router;
