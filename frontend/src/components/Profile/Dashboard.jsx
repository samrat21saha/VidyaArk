// components/Profile/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get("/api/v1/get-all-orders", { headers });
      const orders = res.data.data;

      const delivered = orders.filter(o => o.status === "Delivered");
      const outForDelivery = orders.filter(o => o.status === "Out for delivery");

      const revenue = delivered.reduce(
        (sum, o) => sum + o.book.printPrice,
        0
      );

      // 🔥 TOP SELLING BOOKS
      const bookCount = {};
      orders.forEach(o => {
        const id = o.book._id;
        bookCount[id] = (bookCount[id] || 0) + 1;
      });

      const topSelling = orders
        .map(o => o.book)
        .filter(
          (b, i, arr) =>
            bookCount[b._id] >= 2 &&
            arr.findIndex(x => x._id === b._id) === i
        );

      setStats({
        totalOrders: orders.length,
        delivered: delivered.length,
        outForDelivery: outForDelivery.length,
        revenue,
        topSelling,
      });
    };

    fetchStats();
  }, []);

  if (!stats) return <Loader />;

  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Delivered" value={stats.delivered} />
        <StatCard title="Out for Delivery" value={stats.outForDelivery} />
        <StatCard title="Revenue" value={`₹ ${stats.revenue}`} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Top Selling Books</h2>
        {stats.topSelling.length === 0 ? (
          <p className="text-zinc-400">No top selling books yet</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {stats.topSelling.map(book => (
              <div
                key={book._id}
                className="bg-zinc-900 p-4 rounded-xl border border-zinc-700"
              >
                <p className="font-semibold">{book.title}</p>
                <p className="text-yellow-400">₹ {book.printPrice}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700">
    <p className="text-zinc-400 text-sm">{title}</p>
    <p className="text-2xl font-semibold text-yellow-400 mt-2">{value}</p>
  </div>
);

export default Dashboard;
