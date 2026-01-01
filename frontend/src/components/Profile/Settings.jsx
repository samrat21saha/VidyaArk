// Profile/Settings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPen } from "react-icons/fa";

const Settings = () => {
  const [originalUser, setOriginalUser] = useState(null);
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("/api/v1/user-details", { headers });
      setOriginalUser(res.data);
      setUsername(res.data.username);
      setAddress(res.data.address || "");
      setAvatar(res.data.avatar);
    };
    fetchUser();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.put(
        "/api/v1/update-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAvatar(res.data.avatar);
      setOriginalUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      
      // Trigger refresh in other components
      window.dispatchEvent(new Event("avatarUpdated"));
    } catch {
      alert("Avatar upload failed");
    }
  };

  const handleSave = async () => {
    setLoading(true);

    if (username !== originalUser.username)
      await axios.put("/api/v1/update-username", { username }, { headers });

    if (address !== originalUser.address)
      await axios.put("/api/v1/update-address", { address }, { headers });

    if (password.trim()) {
      await axios.put("/api/v1/update-password", { password }, { headers });
    }

    alert("Profile updated");
    setLoading(false);
  };

  if (!originalUser) return <div>Loading...</div>;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Account Settings</h1>

      {/* AVATAR */}
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={
              avatar && avatar.trim() && avatar.startsWith("http")
                ? avatar
                : avatar && avatar.trim() && avatar.startsWith("/")
                ? `https://vidyaark.onrender.com${avatar}`
                : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border border-zinc-700"
            onError={(e) => {
              e.target.src =
                "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
            }}
          />

          <label className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full cursor-pointer">
            <FaPen className="text-white" />
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              hidden
              onChange={handleAvatarUpload}
            />
          </label>
        </div>
      </div>

      <input
        className="w-full bg-zinc-800 p-3 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <textarea
        className="w-full bg-zinc-800 p-3 rounded"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        type="password"
        className="w-full bg-zinc-800 p-3 rounded"
        placeholder="New password (optional)"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-500 px-6 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Settings;
