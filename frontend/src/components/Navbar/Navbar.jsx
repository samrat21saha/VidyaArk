import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdMenuOpen, MdClose } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import axios from "axios";

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const profileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/v1/user-details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data);
      } catch {
        setUser(null);
        dispatch(authActions.logout());
      }
    };

    fetchUser();

    // Listen for avatar update events
    const handleAvatarUpdate = () => {
      fetchUser();
    };
    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, [isLoggedIn, dispatch]);

  const isAdmin = user?.role === "admin";

  /* ================= CLICK OUTSIDE (DESKTOP) ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(authActions.logout());
    setUser(null);
    setIsMobileOpen(false);
    navigate("/login");
  };

  const commonLinks = [
    { title: "Home", link: "/" },
    { title: "About Us", link: "/about-us" },
    { title: "All Books", link: "/all-books" },
  ];

  const authLinks =
    isLoggedIn && !isAdmin ? [{ title: "Cart", link: "/cart" }] : [];

  const allLinks = [...commonLinks, ...authLinks];

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-40 flex bg-zinc-800 text-white px-6 py-4 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-10 me-3"
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo"
          />
          <h1 className="text-2xl font-semibold">VidyaArk</h1>
        </Link>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex items-center gap-6">
          {allLinks.map((l) => (
            <Link
              key={l.title}
              to={l.link}
              className="hover:text-blue-500 transition"
            >
              {l.title}
            </Link>
          ))}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-1 border border-blue-500 rounded hover:bg-blue-500 transition"
              >
                LogIn
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 bg-blue-500 rounded"
              >
                SignUp
              </Link>
            </>
          ) : (
            user && (
              <div ref={profileRef} className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  <img
                    src={
                      user.avatar && user.avatar.trim() && user.avatar.startsWith("http")
                        ? user.avatar
                        : user.avatar && user.avatar.trim() && user.avatar.startsWith("/")
                        ? `https://vidyaark.onrender.com${user.avatar}`
                        : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                    }
                    alt="avatar"
                    className="h-8 w-8 rounded-full object-cover border border-zinc-600"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
                    }}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-zinc-700 rounded-xl p-4 z-50 shadow-xl">
                    <div className="flex gap-3 items-center mb-3">
                      <img
                        src={
                          user.avatar && user.avatar.trim() && user.avatar.startsWith("http")
                            ? user.avatar
                            : user.avatar && user.avatar.trim() && user.avatar.startsWith("/")
                            ? `https://vidyaark.onrender.com${user.avatar}`
                            : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                        }
                        className="h-12 w-12 rounded-full object-cover"
                        alt="avatar"
                        onError={(e) => {
                          e.target.src =
                            "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
                        }}
                      />
                      <div>
                        <p className="text-sm text-zinc-400">
                          Signed in as
                        </p>
                        <p className="font-semibold">
                          {isAdmin ? "Admin" : user.username}
                        </p>
                      </div>
                    </div>

                    <hr className="border-zinc-700 mb-3" />

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileOpen(false);
                      }}
                      className="w-full py-2 hover:bg-zinc-800 rounded transition"
                    >
                      {isAdmin ? "View Admin Profile" : "View Profile"}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                    >
                      <AiOutlineLogout />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* ================= MOBILE TOGGLE ================= */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setIsMobileOpen(true)}
        >
          <MdMenuOpen />
        </button>
      </nav>

      {/* ================= MOBILE MENU (CENTERED) ================= */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-800 text-white flex flex-col items-center justify-center gap-6">
          <button
            className="absolute top-6 right-6 text-4xl"
            onClick={() => setIsMobileOpen(false)}
          >
            <MdClose />
          </button>

          {allLinks.map((l) => (
            <Link
              key={l.title}
              to={l.link}
              onClick={() => setIsMobileOpen(false)}
              className="text-2xl hover:text-blue-500 transition"
            >
              {l.title}
            </Link>
          ))}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsMobileOpen(false)}
                className="px-8 py-3 border border-blue-500 rounded text-xl hover:bg-blue-500 transition"
              >
                LogIn
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileOpen(false)}
                className="px-8 py-3 bg-blue-500 rounded text-xl"
              >
                SignUp
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsMobileOpen(false);
                }}
                className="text-2xl hover:text-blue-500 transition"
              >
                {isAdmin ? "View Admin Profile" : "View Profile"}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 text-xl"
              >
                <AiOutlineLogout />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
