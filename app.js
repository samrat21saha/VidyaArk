// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// ================= DATABASE CONNECTION =================
require("./connection/connection");

const app = express();

// ================= MIDDLEWARES =================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://zesty-narwhal-3308aa.netlify.app",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================
// For avatars, book images, PDFs, etc.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/v1", require("./routes/user.routes"));
app.use("/api/v1", require("./routes/book.routes"));
app.use("/api/v1", require("./routes/favourite.routes"));
app.use("/api/v1", require("./routes/cart.routes"));
app.use("/api/v1", require("./routes/order.routes"));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).send("VidyaArk API running successfully 🚀");
});

// ================= SERVER =================
const PORT = process.env.PORT || 5600;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
