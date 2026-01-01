// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import AllBooks from "./pages/AllBooks";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import ViewBookDetails from "./components/ViewBookDetails/ViewBookDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateBookDetails from "./pages/UpdateBookDetails";

import Favourites from "./components/Profile/Favourites";
import UserOrderHistory from "./components/Profile/UserOrderHistory";
import Settings from "./components/Profile/Settings";
import AddBook from "./components/Profile/AddBook";
import AllOrders from "./components/Profile/AllOrders";
import Dashboard from "./components/Profile/Dashboard";

/* ================= ROLE BASED DEFAULT ================= */
const ProfileIndexRouter = () => {
  const role = localStorage.getItem("role");

  if (role === "admin") {
    return <Dashboard />;
  }

  return <Favourites />;
};

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/book-details/:id" element={<ViewBookDetails />} />

        {/* ================= PROFILE (USER + ADMIN) ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        >
          {/* 🔑 ROLE-BASED DEFAULT */}
          <Route index element={<ProfileIndexRouter />} />

          {/* USER */}
          <Route path="orderHistory" element={<UserOrderHistory />} />
          <Route path="settings" element={<Settings />} />

          {/* ADMIN */}
          {/* ADMIN */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-book" element={<AddBook />} />
          <Route path="all-orders" element={<AllOrders />} />
          <Route path="update-book/:id" element={<UpdateBookDetails />} />

        </Route>

        {/* ================= CART ================= */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
