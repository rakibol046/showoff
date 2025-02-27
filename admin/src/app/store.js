import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import productsSliceReducer from "../features/products/productsSlice";
import authSliceReducer from "../features/auth/authSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Add RTK Query API reducer
    auth: authSliceReducer,
    products: productsSliceReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add middleware for RTK Query
});

export default store;
