// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://vidyaark.onrender.com",
});

export default api;
