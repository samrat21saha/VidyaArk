// Profile/AllOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";

/* ================= GROUP ORDERS ================= */
const groupOrdersByCheckout = (orders) => {
  const groups = [];
  const TIME_WINDOW_MS = 5000;

  orders.forEach((order) => {
    const time = new Date(order.createdAt).getTime();
    let added = false;

    for (const group of groups) {
      const groupTime = new Date(group.createdAt).getTime();
      if (Math.abs(time - groupTime) <= TIME_WINDOW_MS) {
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
        user: order.user,
        total: order.book.printPrice,
      });
    }
  });

  return groups;
};

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

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customer, setCustomer] = useState(null);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/v1/get-all-orders", { headers });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderIds, status) => {
    await Promise.all(
      orderIds.map((id) =>
        axios.put(`/api/v1/update-status/${id}`, { status }, { headers })
      )
    );
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="flex justify-center h-full">
        <Loader />
      </div>
    );
  }

  const grouped = groupOrdersByCheckout(orders);

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">All Orders</h1>

        {grouped.map((group, idx) => {
          const orderIds = group.orders.map((o) => o._id);
          const currentStatus = group.orders[0].status;

          return (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-700 rounded-xl p-5"
            >
              {/* HEADER */}
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-zinc-400">
                    {group.user.username} — {group.user.email}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {new Date(group.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-4 py-1 rounded text-white ${statusColor(
                      currentStatus
                    )}`}
                  >
                    {currentStatus}
                  </span>

                  <select
                    value={currentStatus}
                    onChange={(e) =>
                      updateStatus(orderIds, e.target.value)
                    }
                    className="bg-zinc-800 border border-zinc-600 rounded px-3 py-1"
                  >
                    <option>Order Placed</option>
                    <option>Out for delivery</option>
                    <option>Delivered</option>
                    <option>Canceled</option>
                    <option>Returned</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomer(group.user);
                      setShowCustomerModal(true);
                    }}
                    className="px-3 py-1 border border-blue-500 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition"
                  >
                    View Customer
                  </button>
                </div>
              </div>

              {/* BOOK LIST */}
              <div className="space-y-3">
                {group.orders.map((o) => (
                  <div
                    key={o._id}
                    className="bg-zinc-800 p-3 rounded flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={o.book.coverImageUrl}
                        alt={o.book.title}
                        className="h-16 w-12 object-contain bg-zinc-900 rounded"
                      />

                      <div>
                        <p className="font-medium">{o.book.title}</p>
                        <p className="text-sm text-zinc-400">
                          by {o.book.author}
                        </p>
                        <p className="text-sm text-yellow-400">
                          ₹ {o.book.printPrice}
                        </p>
                      </div>
                    </div>

                    {/* ✅ ADDED: VIEW DETAILS BUTTON */}
                    <Link
                      to={`/book-details/${o.book._id}`}
                      className="px-3 py-1 text-sm border border-blue-500 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="mt-4 text-right text-yellow-400 font-semibold">
                Group Total: ₹ {group.total}
              </div>
            </div>
          );
        })}
      </div>

      {/* CUSTOMER POPUP */}
      {showCustomerModal && customer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 w-[90%] max-w-md rounded-xl p-6 relative">
            <button
              onClick={() => setShowCustomerModal(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Customer Details
            </h2>

            <div className="flex gap-4 items-center">
              {/* ✅ FIXED AVATAR */}
              <img
                src={customer.avatar}
                alt={customer.username}
                className="h-20 w-20 rounded-lg object-cover border border-zinc-700 bg-zinc-800"
              />

              <div className="space-y-1">
                <p className="font-semibold">{customer.username}</p>
                <p className="text-sm text-zinc-400">
                  {customer.email}
                </p>
                <p className="text-sm text-zinc-400">
                  {customer.address}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCustomerModal(false)}
              className="mt-6 w-full py-2 border border-zinc-600 rounded hover:bg-zinc-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AllOrders;
