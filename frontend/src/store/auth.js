// store/auth.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: !!localStorage.getItem("token"),
  role: localStorage.getItem("role") || "user",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.role = action.payload.role;

      // ✅ persist role
      localStorage.setItem("role", action.payload.role);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.role = "user";
      localStorage.clear();
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
