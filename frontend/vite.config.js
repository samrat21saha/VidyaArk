// vite.confing.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  server: {
    proxy: {
      "/api": "https://vidyaark.onrender.com",
      "/uploads": "https://vidyaark.onrender.com",
    },
  },
});
