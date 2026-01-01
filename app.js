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
    origin: "*", // later you can restrict this to frontend domain
    credentials: true,
  })
);

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
