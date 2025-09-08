import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  username: null,
  name: null,
  email: null,
  avatar: null,
  token: null,   // ✅ add token field
  isAuthenticated: false,
  loading: false,
  error: null,
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setUser(state, action) {
      const { id, username, name, email, avatar, token } = action.payload;
      state.id = id;
      state.username = username;
      state.name = name;
      state.email = email;
      state.avatar = avatar;
      state.token = token;  // ✅ save token
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    clearUser(state) {
      state.id = null;
      state.username = null;
      state.name = null;
      state.email = null;
      state.avatar = null;
      state.token = null;  // ✅ clear token
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
