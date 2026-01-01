// pages/AllBooks.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";

const AllBooks = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");

  /* ================= FETCH BOOKS ================= */
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/api/v1/get-all-books");
        setData(res.data.books || []);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        // ❌ keep loader
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  /* ================= SEARCH + SORT ================= */
  const filteredBooks = useMemo(() => {
    let books = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      books = books.filter((book) =>
        Object.values(book).some((v) =>
          String(v).toLowerCase().includes(q)
        )
      );
    }

    switch (filterOption) {
      case "price-low-high":
        books.sort((a, b) => a.printPrice - b.printPrice);
        break;
      case "price-high-low":
        books.sort((a, b) => b.printPrice - a.printPrice);
        break;
      case "latest":
        books.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        books.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      default:
        break;
    }

    return books;
  }, [data, searchQuery, filterOption]);

  return (
    <div className="bg-zinc-900 min-h-screen px-12 py-8">
      <h4 className="text-3xl text-yellow-100 mb-6">
        All Books
      </h4>

      {/* 🔍 SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title, author, category, price, pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="px-4 py-2 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">Sort / Filter</option>
          <option value="price-low-high">Price: Low → High</option>
          <option value="price-high-low">Price: High → Low</option>
          <option value="latest">Latest Added</option>
          <option value="oldest">Oldest Added</option>
        </select>
      </div>

      {/* ⏳ LOADER (default + error + empty + no match) */}
      {(loading || filteredBooks.length === 0) && (
        <div className="flex items-center justify-center my-20">
          <Loader />
        </div>
      )}

      {/* 📚 BOOK GRID */}
      {!loading && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {filteredBooks.map((item) => (
            <BookCard key={item._id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
