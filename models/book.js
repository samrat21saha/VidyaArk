const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(

  {
    pdfUrl: { type: String, required: true },
    coverImageUrl: { type: String, required: true },

    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },

    pages: { type: Number, required: true, min: 1 },
    printPrice: { type: Number, required: true, min: 0 },

    category: {type: String,required: true,trim: true,},

    desc: { type: String, required: true },
    lang: { type: String, required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Book", bookSchema);
