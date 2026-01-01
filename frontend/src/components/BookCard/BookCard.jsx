import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import api from "../../api/axios";

const BookCard = ({ data }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const isAdmin = role === "admin";

  const token = localStorage.getItem("token");

  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  /* ================= SYNC FAV ================= */
  useEffect(() => {
    if (!isLoggedIn || isAdmin || !token) return;

    const syncFavourite = async () => {
      try {
        const res = await api.get("/get-favourite-books", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const favIds = res.data.favourites.map((b) => b._id.toString());
        setIsFavourite(favIds.includes(data._id.toString()));
      } catch (err) {
        console.error("Favourite sync failed", err);
      }
    };

    syncFavourite();
  }, [isLoggedIn, isAdmin, data._id, token]);

  /* ================= TOGGLE ================= */
  const toggleFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn || isAdmin || loading) return;

    setLoading(true);

    try {
      const res = await api.put(
        `/toggle-favourite/${data._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFavourite(res.data.isFavourite);
      setToast({
        type: "success",
        message: res.data.isFavourite
          ? "Book added to favourites ❤️"
          : "Book removed from favourites",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: "Failed to update favourites ❌",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="relative bg-zinc-800 rounded-xl p-4 h-[420px] flex flex-col hover:shadow-xl transition">
      {isLoggedIn && !isAdmin && (
        <button
          onClick={toggleFavourite}
          disabled={loading}
          className="absolute top-4 right-4 bg-white rounded-full p-2 text-xl text-red-500 hover:scale-110 transition z-30"
        >
          {isFavourite ? <FaHeart /> : <FaRegHeart />}
        </button>
      )}

      {toast && (
        <div
          className={`absolute top-14 right-4 px-4 py-2 rounded-lg text-sm font-semibold z-40
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {toast.message}
        </div>
      )}

      <Link to={`/book-details/${data._id}`}>
        <div className="bg-zinc-900 rounded-lg h-[220px] flex items-center justify-center overflow-hidden">
          <img
            src={data.coverImageUrl}
            alt={data.title}
            className="h-full object-contain hover:scale-110 transition"
          />
        </div>

        <h2 className="mt-4 text-lg font-semibold line-clamp-2 text-yellow-100">
          {data.title}
        </h2>

        <p className="mt-1 text-zinc-400">by {data.author}</p>
      </Link>

      <div className="flex-grow" />

      <p className="mt-3 text-center text-lg font-semibold text-yellow-100">
        Print Price: ₹{data.printPrice}
      </p>

      <a
        href={data.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 bg-yellow-200 hover:bg-yellow-100 text-black font-semibold py-2 rounded-lg text-center"
      >
        Download PDF
      </a>
    </div>
  );
};

export default BookCard;
