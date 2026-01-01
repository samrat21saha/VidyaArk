// ViewBookDetails/ViewBookDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import api from "../../api/axios";

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const isAdmin = role === "admin";

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFavourite, setIsFavourite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH BOOK ================= */
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/v1/book-details/${id}`);
        setBook(res.data);
      } catch {
        setError("Failed to load book");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  /* ================= CHECK FAVOURITE ================= */
  useEffect(() => {
    if (!isLoggedIn || !book || isAdmin) return;

    const checkFavourite = async () => {
      try {
        const res = await api.get("/get-favourite-books", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const exists = res.data.favourites.some(
          (b) => b._id.toString() === book._id.toString()
        );
        setIsFavourite(exists);
      } catch (err) {
        console.error("Favourite check failed", err);
      }
    };

    checkFavourite();
  }, [book, isLoggedIn, isAdmin]);

  /* ================= TOGGLE FAVOURITE ================= */
  const toggleFavourite = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (favLoading) return;
    setFavLoading(true);

    try {
      const res = await api.put(
        `/toggle-favourite/${book._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFavourite(res.data.isFavourite);
      setMessage(
        res.data.isFavourite
          ? "Book added to favourites ❤️"
          : "Book removed from favourites"
      );
    } catch (err) {
      console.error("Toggle favourite error", err);
      setMessage("Favourite action failed");
    } finally {
      setFavLoading(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (cartLoading) return;
    setCartLoading(true);

    try {
      const res = await axios.put(
        `/api/v1/add-to-cart/${book._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
    } catch {
      setMessage("Failed to add to cart");
    } finally {
      setCartLoading(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  /* ================= DELETE BOOK (ADMIN) ================= */
  const deleteBook = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete("/api/v1/delete-book", {
        headers: {
          Authorization: `Bearer ${token}`,
          bookid: book._id,
        },
      });

      navigate("/all-books");
    } catch {
      alert("Failed to delete book");
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-zinc-300">
        Loading book details...
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-red-400">
        {error || "Book not found"}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="bg-zinc-900 min-h-screen px-4 md:px-12 py-8 text-white flex flex-col md:flex-row gap-10">
      {/* LEFT */}
      <div className="relative md:w-[35%] bg-zinc-800 rounded-lg p-4 flex items-center justify-center">
        {!isAdmin && (
          <button
            onClick={toggleFavourite}
            disabled={favLoading}
            className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 text-xl text-red-500 hover:scale-110 transition"
          >
            {isFavourite ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}

        <img
          src={book.coverImageUrl}
          alt={book.title}
          className="h-[60vh] md:h-[80vh] object-contain"
        />
      </div>

      {/* RIGHT */}
      <div className="md:w-[65%] space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{book.title}</h1>
          <p className="mt-2 text-zinc-400">by {book.author}</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-zinc-300">
          <span>Category: {book.category}</span>
          <span>Language: {book.lang}</span>
          <span>Pages: {book.pages}</span>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-zinc-300">{book.desc}</p>
        </div>

        <div>
          <span className="text-3xl font-semibold text-yellow-400">
            ₹ {book.printPrice}
          </span>
        </div>

        {/* 🔒 SAME BUTTON POSITIONS — ONLY CONTENT CHANGES */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!isAdmin ? (
            <button
              onClick={addToCart}
              disabled={cartLoading}
              className="bg-yellow-300 hover:bg-yellow-200 text-black px-6 py-3 rounded font-semibold transition"
            >
              Add to Cart
            </button>
          ) : (
            <button
              onClick={() => navigate(`/profile/update-book/${book._id}`)}
              className="bg-yellow-300 hover:bg-yellow-200 text-black px-6 py-3 rounded font-semibold transition"
            >
              Edit Book
            </button>
          )}

          {!isAdmin ? (
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-zinc-600 hover:bg-zinc-800 px-6 py-3 rounded font-semibold transition text-center"
            >
              Download PDF
            </a>
          ) : (
            <button
              onClick={deleteBook}
              className="border border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-6 py-3 rounded font-semibold transition"
            >
              Delete Book
            </button>
          )}
        </div>

        {message && (
          <p className="text-green-400 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ViewBookDetails;
