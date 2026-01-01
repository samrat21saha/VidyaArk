import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchFavourites = async () => {
      try {
        const res = await api.get("/get-favourite-books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Favourites response:", res.data);
        const favouritesList = res.data?.favourites || res.data || [];
        setFavourites(Array.isArray(favouritesList) ? favouritesList : []);
      } catch (err) {
        console.error("Failed to fetch favourites", err);
        setFavourites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [token]);

  const removeFromFavourite = async (bookId) => {
    try {
      await api.put(
        `/toggle-favourite/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFavourites((prev) =>
        prev.filter((book) => book._id.toString() !== bookId.toString())
      );
    } catch (err) {
      console.error("Failed to remove favourite", err);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-2xl font-semibold text-white opacity-50">
          No books in favourites
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-semibold mb-6">
        Your Favourite Books
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favourites.map((book) => (
          <div
            key={book._id}
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex flex-col"
          >
            <div className="h-56 w-full flex items-center justify-center bg-zinc-800 rounded-lg mb-4">
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="h-full object-contain"
              />
            </div>

            <h2 className="text-lg font-semibold text-yellow-100 line-clamp-2">
              {book.title}
            </h2>

            <p className="text-sm text-zinc-400 mb-2">{book.author}</p>

            <p className="text-center text-yellow-100 font-semibold mb-3">
              Print Price: ₹{book.printPrice}
            </p>

            <div className="mt-auto flex gap-2">
              <Link
                to={`/book-details/${book._id}`}
                className="flex-1 text-center py-2 rounded bg-blue-500 hover:bg-blue-600 transition"
              >
                View
              </Link>

              <button
                onClick={() => removeFromFavourite(book._id)}
                className="flex-1 py-2 rounded border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
