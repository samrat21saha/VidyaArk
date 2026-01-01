// pages/Profile.jsx
import axios from "axios";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/v1/user-details", { headers });
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  /* ================= DEFAULT REDIRECT ================= */
  useEffect(() => {
    if (!profile) return;

    // Only redirect if user is exactly on /profile
    if (location.pathname === "/profile") {
      if (profile.role === "admin") {
        navigate("/profile/dashboard", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, [profile, location.pathname, navigate]);

  if (!profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row h-screen py-8 gap-4 text-white">
      {/* LEFT SIDEBAR */}
      <div className="w-full md:w-1/6">
        <Sidebar data={profile} />
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-full md:w-5/6 bg-zinc-800 rounded p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
