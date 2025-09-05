import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    initialized: false, // becomes true after first onAuthStateChanged fires
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setInitialized: (state, action) => {
      state.initialized = action.payload;
    },
    updateProfileInfo: (state, action) => {
      if (!state.user) return;
      const { displayName, photoURL } = action.payload;
      state.user.displayName = displayName;
      state.user.photoURL = photoURL;
    },
  },
});

export const { login, logout, setInitialized, updateProfileInfo } = authSlice.actions;
export default authSlice.reducer;