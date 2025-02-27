import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: undefined,
  admin: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    adminLogIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.admin = action.payload.admin;
    },
    adminLogOut: (state, action) => {
      state.accessToken = undefined;
      state.admin = undefined;
    },
  },
});

export const { adminLogIn, adminLogOut } = authSlice.actions;
export default authSlice.reducer;
