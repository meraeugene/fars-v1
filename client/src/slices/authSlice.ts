import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdminToken: (state, action) => {
      state.adminToken = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("jwt");
      state.adminToken = null;
    },
  },
});

export const { logout, setAdminToken } = authSlice.actions;

export default authSlice.reducer;
