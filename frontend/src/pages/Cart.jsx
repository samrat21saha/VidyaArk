// pages/Cart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  /* ================= FETCH CART ================= */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("/api/v1/get-cart", { headers });
        setCartItems(res.data.cart || []);

        // initialize quantity = 1
        const qtyMap = {};
        res.data.cart.forEach((item) => {
          qtyMap[item._id] = 1;
        });
        setQuantities(qtyMap);
      } catch (error) {
        console.error("Failed to fetch cart", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  /* ================= QUANTITY CHANGE ================= */
  const updateQty = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, Number(value)),
    }));
  };

  /* ================= REMOVE ================= */
  const removeFromCart = async (bookId) => {
    await axios.put(`/api/v1/remove-from-cart/${bookId}`, {}, { headers });
    setCartItems((prev) => prev.filter((b) => b._id !== bookId));
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (cartItems.length === 0) return;

    const payload = cartItems.map((item) => ({
      bookId: item._id,
      quantity: quantities[item._id],
    }));

    try {
      setPlacingOrder(true);
      await axios.post(
        "/api/v1/place-order",
        { Order: payload },
        { headers }
      );

      navigate("/profile/orderHistory");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ================= TOTAL ================= */
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + item.printPrice * (quantities[item._id] || 1),
    0
  );

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <p className="text-xl text-white opacity-50">Your cart is empty</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-zinc-900 px-6 py-10 text-white">
      <h1 className="text-3xl font-semibold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((book) => (
            <div
              key={book._id}
              className="flex gap-4 bg-zinc-800 p-4 rounded-lg items-center"
            >
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="h-24 w-16 object-contain bg-zinc-900 rounded"
              />

              <div className="flex-1">
                <h2 className="font-semibold">{book.title}</h2>
                <p className="text-sm text-zinc-400">by {book.author}</p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400 font-semibold">
                    ₹ {book.printPrice}
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={quantities[book._id]}
                    onChange={(e) =>
                      updateQty(book._id, e.target.value)
                    }
                    className="w-16 px-2 py-1 bg-zinc-900 border border-zinc-600 rounded text-center"
                  />

                  <span className="text-yellow-400">
                    = ₹ {book.printPrice * quantities[book._id]}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to={`/book-details/${book._id}`}
                  className="px-3 py-1 text-sm border border-blue-500 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition text-center"
                >
                  Details
                </Link>

                <button
                  onClick={() => removeFromCart(book._id)}
                  className="px-3 py-1 text-sm border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-zinc-800 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total Price</span>
            <span className="text-yellow-400">₹ {totalPrice}</span>
          </div>

          <button
            disabled={placingOrder}
            onClick={placeOrder}
            className="w-full py-3 bg-green-500 hover:bg-green-600 rounded font-semibold transition disabled:opacity-60"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
