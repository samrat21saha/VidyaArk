// components/Home/RecentlyAdded.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const RecentlyAdded = () => {
  const [data, setData] = useState([]);     // ✅ MUST be array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔁 RecentlyAdded mounted");

    const fetchRecent = async () => {
      try {
        console.log("📡 Fetching recent books...");

        const res = await axios.get(
          "http://localhost:5600/api/v1/recent-books" // ✅ FORCE BACKEND
        );

        console.log("✅ API response:", res.data);

        setData(Array.isArray(res.data.book) ? res.data.book : []);
      } catch (err) {
        console.error("❌ Failed to fetch recent books", err);
        setData([]); // fail-safe
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  console.log("➡ loading:", loading);
  console.log("➡ data:", data);

  return (
    <div className="mt-8 px-4">
      <h4 className="text-3xl text-yellow-100 mb-4">
        Recently Added Books
      </h4>

      {/* ⏳ LOADER ONLY */}
      {loading && (
        <div className="flex justify-center mt-10">
          <Loader />
        </div>
      )}

      {/* 📚 BOOK GRID */}
      {!loading && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {data.map((item) => (
            <BookCard key={item._id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyAdded;
