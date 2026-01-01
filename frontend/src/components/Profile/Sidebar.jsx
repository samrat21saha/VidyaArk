// Profile/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `py-2 text-center rounded transition-all ${isActive
      ? "bg-zinc-900 text-white"
      : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
    }`;

  const isAdmin = data?.role === "admin";

  return (
    <div className="bg-zinc-800 p-4 rounded flex flex-col items-center justify-between h-full">
      {/* ================= USER INFO ================= */}
      <div className="flex flex-col items-center w-full">
        <img
          src={
            data?.avatar && data.avatar.trim() && data.avatar.startsWith("http")
              ? data.avatar
              : data?.avatar && data.avatar.trim() && data.avatar.startsWith("/")
              ? `https://vidyaark.onrender.com${data.avatar}`
              : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
          }
          onError={(e) => {
            e.target.src =
              "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
          }}
          alt="avatar"
          className="h-[12vh] w-[12vh] rounded-full object-cover border border-zinc-600"
        />

        <p className="mt-3 text-xl font-semibold">{data.username}</p>
        <p className="text-zinc-400 text-sm">{data.email}</p>
        <hr className="w-full border-zinc-700 my-4" />
      </div>

      {/* ================= NAVIGATION ================= */}
      <div className="w-full flex flex-col gap-2">
        {/* ===== USER ===== */}
        {!isAdmin && (
          <>
            <NavLink to="/profile" end className={navLinkClass}>
              Favourites
            </NavLink>

            <NavLink to="/profile/orderHistory" className={navLinkClass}>
              Order History
            </NavLink>

            <NavLink to="/profile/settings" className={navLinkClass}>
              Settings
            </NavLink>
          </>
        )}

        {/* ===== ADMIN ===== */}
        {isAdmin && (
          <>
            {/* ✅ FIX: POINT TO /profile/dashboard */}
            <NavLink
              to="/profile/dashboard"
              className={navLinkClass}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/profile/all-orders"
              className={navLinkClass}
            >
              All Orders
            </NavLink>

            <NavLink
              to="/profile/add-book"
              className={navLinkClass}
            >
              Add Book
            </NavLink>

            <NavLink
              to="/profile/settings"
              className={navLinkClass}
            >
              Settings
            </NavLink>
          </>
        )}
      </div>

      {/* ================= LOGOUT ================= */}
      <button
        onClick={logoutHandler}
        className="mt-6 w-full flex items-center justify-center gap-2 py-2 border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
      >
        <AiOutlineLogout className="text-lg" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
