import { createSlice } from "@reduxjs/toolkit";



const storedAuth = JSON.parse(localStorage.getItem("authState"));

const initialState = storedAuth || {
  user: null,
  isAuthenticated: false,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {      
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("authState", JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authState");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
