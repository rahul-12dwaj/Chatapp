// src/redux/currentUserSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if available
const savedUser = JSON.parse(localStorage.getItem("currentUser"));

const initialState = savedUser
  ? { ...savedUser, isAuthenticated: true, loading: false, error: null }
  : {
      id: null,
      username: null,
      name: null,
      email: null,
      avatar: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    // Set user on login
    setUser(state, action) {
      const { id, username, name, email, avatar, token } = action.payload;
      state.id = id;
      state.username = username;
      state.name = name;
      state.email = email;
      state.avatar = avatar;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // Persist user to localStorage
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },

    // Clear user on logout
    clearUser(state) {
      localStorage.removeItem("currentUser");
      state.id = null;
      state.username = null;
      state.name = null;
      state.email = null;
      state.avatar = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = currentUserSlice.actions;
export default currentUserSlice.reducer;
