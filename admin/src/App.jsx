import { Routes, Route, Navigate } from "react-router";
import React from "react";
import MainLayout from "./layout/MainLayout.jsx";
import Home from "./pages/home/Home.jsx";
import Products from "./pages/product/Products.jsx";
import Login from "./pages/auth/Login.jsx";
import Category from "./pages/category/Category.jsx";
import CreateCategory from "./pages/category/CreateCategory.jsx";
import useAuthCheck from "./hooks/useAuthCheck.js";
import useAuth from "./hooks/useAuth.js";
import HeroSlider from "./pages/hero-slider/HeroSlider.jsx";
import CreateProduct from "./pages/product/CreateProduct.jsx";

export default function App() {
  const authChecked = useAuthCheck();
  const isLoggedIn = useAuth();

  if (!authChecked) {
    return <div>Checking auth...</div>;
  }

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />}
      />

      {/* Protected routes, wrapped in MainLayout */}
      {isLoggedIn && (
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          {/* Product Routes */}
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<CreateProduct />} />

          {/* Categories Routes */}
          <Route path="categories" element={<Category />} />
          <Route path="add-category" element={<CreateCategory />} />

          {/* Slider Routes */}
          <Route path="sliders" element={<HeroSlider />} />
          <Route path="slider/add" element={<CreateCategory />} />
        </Route>
      )}

      {/* Fallback route for unauthorized access */}
      {!isLoggedIn && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}
