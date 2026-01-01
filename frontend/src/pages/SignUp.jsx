import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const [passwordFeedback, setPasswordFeedback] = useState({
    message: "",
    isStrong: false,
  });

  const [emailFeedback, setEmailFeedback] = useState({
    message: "",
    isValid: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- EMAIL VALIDATION ----------------
  const validateEmail = (email) => {
    const hasNoSpaces = !/\s/.test(email);
    const isLowercase = email === email.toLowerCase();
    const validPattern = /\S+@\S+\.\S+/.test(email);

    if (!email) {
      setEmailFeedback({ message: "", isValid: false });
    } else if (!hasNoSpaces) {
      setEmailFeedback({ message: "Email must not contain spaces", isValid: false });
    } else if (!isLowercase) {
      setEmailFeedback({ message: "Email must be in lowercase only", isValid: false });
    } else if (!validPattern) {
      setEmailFeedback({ message: "Invalid email format", isValid: false });
    } else {
      setEmailFeedback({ message: "Valid email ✔", isValid: true });
    }
  };

  // ---------------- PASSWORD VALIDATION (WARNING ONLY) ----------------
  const validatePassword = (password) => {
    const minLength = password.length >= 7;
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (minLength && hasNumber && hasSpecialChar) {
      setPasswordFeedback({
        message: "Strong password ✔",
        isStrong: true,
      });
    } else {
      setPasswordFeedback({
        message:
          "Weak password (recommended: min 7 chars, number & special character)",
        isStrong: false,
      });
    }
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailFeedback.isValid) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      // ✅ CORRECT ENDPOINT
      const res = await axios.post(
        "https://vidyaark.onrender.com/api/v1/sign-up",
        formData
      );

      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      alert(message);

      if (message === "Email already exist") {
        navigate("/login");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 p-8 rounded-xl shadow-lg space-y-5"
      >
        <h1 className="text-2xl font-semibold text-center">
          Create Your Account
        </h1>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Username</label>
          <input
            type="text"
            name="username"
            required
            minLength={4}
            className="w-full p-3 rounded bg-zinc-800 outline-none"
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Email Address</label>
          <input
            type="email"
            name="email"
            required
            className="w-full p-3 rounded bg-zinc-800 outline-none"
            onChange={(e) => {
              handleChange(e);
              validateEmail(e.target.value);
            }}
          />

          {emailFeedback.message && (
            <p
              className={`text-sm ${
                emailFeedback.isValid ? "text-green-400" : "text-red-400"
              }`}
            >
              {emailFeedback.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              className="w-full p-3 pr-10 rounded bg-zinc-800 outline-none"
              onChange={(e) => {
                handleChange(e);
                validatePassword(e.target.value);
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {passwordFeedback.message && (
            <p
              className={`text-sm ${
                passwordFeedback.isStrong
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {passwordFeedback.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Address</label>
          <textarea
            name="address"
            required
            className="w-full p-3 rounded bg-zinc-800 outline-none resize-none"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 py-3 rounded text-white font-semibold transition-all hover:bg-white hover:text-zinc-800"
        >
          SignUp
        </button>
      </form>
    </div>
  );
};

export default SignUp;
