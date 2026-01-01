// pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/v1/sign-in", credentials);

      const token = res.data.token;
      const userId = res.data.userId;

      localStorage.setItem("token", token);
      localStorage.setItem("id", userId);

      // ✅ FETCH REAL ROLE FROM BACKEND
      const profileRes = await axios.get("/api/v1/user-details", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const role = profileRes.data.role;

      // ✅ STORE ROLE
      localStorage.setItem("role", role);

      dispatch(authActions.login({ role }));

      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 p-8 rounded-xl space-y-5"
      >
        <h1 className="text-2xl font-semibold text-center">Welcome Back</h1>

        <input
          type="text"
          name="identifier"
          placeholder="Username or Email"
          required
          className="w-full p-3 rounded bg-zinc-800"
          onChange={handleChange}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 pr-10 rounded bg-zinc-800"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <button className="w-full py-3 border border-blue-500 rounded hover:bg-white hover:text-black">
          Login
        </button>
      </form>
    </div>
  );
};

export default LogIn;
