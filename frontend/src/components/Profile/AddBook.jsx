// Profile/AddBook.jsx
import React, { useState } from "react";
import axios from "axios";


const AddBook = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    pages: "",
    printPrice: "",
    category: "",
    lang: "",
    pdfUrl: "",
    coverImageUrl: "",
    desc: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("/api/v1/add-book", form, { headers });

      setMessage("✅ Book added successfully");

      // reset form
      setForm({
        title: "",
        author: "",
        pages: "",
        printPrice: "",
        category: "",
        lang: "",
        pdfUrl: "",
        coverImageUrl: "",
        desc: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Failed to add book"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Add New Book</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 space-y-5"
      >
        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full bg-zinc-800 p-3 rounded outline-none"
        />

        {/* AUTHOR */}
        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={form.author}
          onChange={handleChange}
          required
          className="w-full bg-zinc-800 p-3 rounded outline-none"
        />

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="pages"
            placeholder="Pages"
            value={form.pages}
            onChange={handleChange}
            required
            className="bg-zinc-800 p-3 rounded outline-none"
          />

          <input
            type="number"
            name="printPrice"
            placeholder="Price (₹)"
            value={form.printPrice}
            onChange={handleChange}
            required
            className="bg-zinc-800 p-3 rounded outline-none"
          />
        </div>

        {/* CATEGORY + LANGUAGE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="bg-zinc-800 p-3 rounded outline-none"
          />

          <input
            type="text"
            name="lang"
            placeholder="Language"
            value={form.lang}
            onChange={handleChange}
            required
            className="bg-zinc-800 p-3 rounded outline-none"
          />
        </div>

        {/* PDF URL */}
        <input
          type="text"
          name="pdfUrl"
          placeholder="PDF URL"
          value={form.pdfUrl}
          onChange={handleChange}
          required
          className="w-full bg-zinc-800 p-3 rounded outline-none"
        />

        {/* COVER IMAGE */}
        <input
          type="text"
          name="coverImageUrl"
          placeholder="Cover Image URL"
          value={form.coverImageUrl}
          onChange={handleChange}
          required
          className="w-full bg-zinc-800 p-3 rounded outline-none"
        />

        {/* DESCRIPTION */}
        <textarea
          name="desc"
          placeholder="Book Description"
          value={form.desc}
          onChange={handleChange}
          required
          rows={4}
          className="w-full bg-zinc-800 p-3 rounded outline-none"
        />

        {/* ACTION */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded font-semibold transition disabled:opacity-60"
        >
          {loading ? "Adding Book..." : "Add Book"}
        </button>

        {message && (
          <p className="text-center text-sm mt-2 text-green-400">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddBook;
