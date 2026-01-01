import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader/Loader";

const UpdateBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "",
    lang: "",
    pages: "",
    printPrice: "",
    pdfUrl: "",
    coverImageUrl: "",
    desc: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  /* ================= FETCH BOOK ================= */
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/v1/book-details/${id}`);
        setBook({
          title: res.data.title,
          author: res.data.author,
          category: res.data.category,
          lang: res.data.lang,
          pages: res.data.pages,
          printPrice: res.data.printPrice,
          pdfUrl: res.data.pdfUrl,
          coverImageUrl: res.data.coverImageUrl,
          desc: res.data.desc,
        });
      } catch (error) {
        console.error("Failed to load book details", error);
        setMessage("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= UPDATE BOOK ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `/api/v1/update-book/${id}`,
        book,
        { headers }
      );

      navigate("/all-books");
    } catch (error) {
      console.error("Update failed", error);
      setMessage("Failed to update book");
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-zinc-900 px-6 py-10 text-white">
      <h1 className="text-3xl font-semibold mb-6">
        Update Book Details
      </h1>

      <form
        onSubmit={handleUpdate}
        className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* TITLE */}
        <input
          type="text"
          name="title"
          value={book.title}
          onChange={handleChange}
          placeholder="Book Title"
          className="p-3 rounded bg-zinc-800"
          required
        />

        {/* AUTHOR */}
        <input
          type="text"
          name="author"
          value={book.author}
          onChange={handleChange}
          placeholder="Author Name"
          className="p-3 rounded bg-zinc-800"
          required
        />

        {/* CATEGORY */}
        <input
          type="text"
          name="category"
          value={book.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-3 rounded bg-zinc-800"
          required
        />

        {/* LANGUAGE */}
        <input
          type="text"
          name="lang"
          value={book.lang}
          onChange={handleChange}
          placeholder="Language"
          className="p-3 rounded bg-zinc-800"
          required
        />

        {/* PAGES */}
        <input
          type="number"
          name="pages"
          value={book.pages}
          onChange={handleChange}
          placeholder="Number of Pages"
          className="p-3 rounded bg-zinc-800"
          required
        />

        {/* PRICE */}
        <input
          type="number"
          name="printPrice"
          value={book.printPrice}
          onChange={handleChange}
          placeholder="Print Price (₹)"
          className="p-3 rounded bg-zinc-800"
          required
        />

        {/* PDF URL */}
        <input
          type="text"
          name="pdfUrl"
          value={book.pdfUrl}
          onChange={handleChange}
          placeholder="PDF URL"
          className="p-3 rounded bg-zinc-800 col-span-full"
          required
        />

        {/* COVER IMAGE URL */}
        <input
          type="text"
          name="coverImageUrl"
          value={book.coverImageUrl}
          onChange={handleChange}
          placeholder="Cover Image URL"
          className="p-3 rounded bg-zinc-800 col-span-full"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="desc"
          value={book.desc}
          onChange={handleChange}
          placeholder="Book Description"
          rows={5}
          className="p-3 rounded bg-zinc-800 col-span-full"
          required
        />

        {/* ACTION */}
        <div className="col-span-full flex gap-4 mt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded font-semibold"
          >
            Update Book
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-zinc-600 rounded hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>

        {message && (
          <p className="col-span-full text-red-400 text-sm">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UpdateBookDetails;
