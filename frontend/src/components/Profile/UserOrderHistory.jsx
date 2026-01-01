// Profile/UserOrderHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";

/* ================= GROUP ORDERS ================= */
const groupOrdersByCheckout = (orders) => {
  const groups = [];
  const TIME_WINDOW_MS = 5000;

  orders.forEach((order) => {
    const orderTime = new Date(order.createdAt).getTime();
    let added = false;

    for (const group of groups) {
      const groupTime = new Date(group.createdAt).getTime();
      if (Math.abs(orderTime - groupTime) <= TIME_WINDOW_MS) {
        group.orders.push(order);
        group.total += order.book.printPrice;
        added = true;
        break;
      }
    }

    if (!added) {
      groups.push({
        createdAt: order.createdAt,
        orders: [order],
        total: order.book.printPrice,
        status: order.status,
      });
    }
  });

  return groups;
};

/* ================= STATUS COLORS ================= */
const statusColor = (status) => {
  switch (status) {
    case "Order Placed":
      return "bg-blue-600";
    case "Out for delivery":
      return "bg-yellow-500 text-black";
    case "Delivered":
      return "bg-green-600";
    case "Canceled":
      return "bg-red-600";
    case "Returned":
      return "bg-purple-600";
    default:
      return "bg-zinc-600";
  }
};

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/v1/get-order-history", { headers });
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch order history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= CANCEL ================= */
  const cancelGroup = async (orderIds) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    await Promise.all(
      orderIds.map((id) =>
        axios.put(`/api/v1/cancel-order/${id}`, {}, { headers })
      )
    );

    fetchOrders();
  };

  /* ================= RETURN ================= */
  const returnGroup = async (orderIds) => {
    if (!window.confirm("Are you sure you want to return this order?")) return;

    await Promise.all(
      orderIds.map((id) =>
        axios.put(
          `/api/v1/update-status/${id}`,
          { status: "Returned" },
          { headers }
        )
      )
    );

    fetchOrders();
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-xl opacity-50">No orders placed yet</p>
      </div>
    );
  }

  const groupedOrders = groupOrdersByCheckout(orders);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Order History</h1>

      <div className="space-y-6">
        {groupedOrders.map((group, index) => {
          const orderIds = group.orders.map((o) => o._id);
          const deliveredAt = new Date(group.createdAt);
          const within7Days =
            Date.now() - deliveredAt.getTime() <=
            7 * 24 * 60 * 60 * 1000;

          const canCancel = group.status === "Order Placed";
          const canReturn =
            group.status === "Delivered" && within7Days;

          return (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-700 rounded-xl p-5"
            >
              {/* ================= HEADER ================= */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                <div>
                  <p className="text-sm text-zinc-400">
                    Ordered on {new Date(group.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-zinc-400">
                    Items: {group.orders.length}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-4 py-1 text-sm rounded text-white ${statusColor(
                      group.status
                    )}`}
                  >
                    {group.status}
                  </span>

                  <span className="text-yellow-400 font-semibold">
                    Total: ₹ {group.total}
                  </span>

                  {canCancel && (
                    <button
                      onClick={() => cancelGroup(orderIds)}
                      className="px-3 py-1 text-sm border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                    >
                      Cancel
                    </button>
                  )}

                  {canReturn && (
                    <button
                      onClick={() => returnGroup(orderIds)}
                      className="px-3 py-1 text-sm border border-purple-500 text-purple-400 rounded hover:bg-purple-500 hover:text-white transition"
                    >
                      Return
                    </button>
                  )}
                </div>
              </div>

              {/* ================= ITEMS ================= */}
              <div className="space-y-4">
                {group.orders.map((order) => (
                  <div
                    key={order._id}
                    className="flex gap-4 items-center bg-zinc-800 p-4 rounded-lg"
                  >
                    {/* IMAGE */}
                    <img
                      src={order.book.coverImageUrl}
                      alt={order.book.title}
                      className="h-24 w-16 object-contain bg-zinc-900 rounded"
                    />

                    {/* INFO */}
                    <div className="flex-1">
                      <h2 className="font-semibold text-white line-clamp-2">
                        {order.book.title}
                      </h2>
                      <p className="text-sm text-zinc-400">
                        by {order.book.author}
                      </p>
                      <p className="mt-1 text-yellow-400 font-semibold">
                        ₹ {order.book.printPrice}
                      </p>
                    </div>

                    {/* VIEW BUTTON (SMALL & SLIM) */}
                    <Link
                      to={`/book-details/${order.book._id}`}
                      className="
                        px-3 py-1
                        text-sm
                        border border-blue-500
                        text-blue-400
                        rounded
                        hover:bg-blue-500
                        hover:text-white
                        transition
                      "
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserOrderHistory;
