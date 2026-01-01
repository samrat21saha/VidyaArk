const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  book: {
    type: mongoose.Types.ObjectId,
    ref: "Book",
  },
  status: {
    type: String, default: "Order Placed",
    enum: ["Order placed", "Out for delivery", "Delivered", "Canceled", "Downloaded"]
  },
}, { timestamps: true });


module.exports = mongoose.model("Order", orderSchema);



