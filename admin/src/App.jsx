import { useNavigate, Routes, Route } from "react-router";
import React, { useState, useRef, useEffect } from "react";
// import api from "./api/api.js";
import MainLayout from "./layout/MainLayout.jsx";
import Home from "./pages/home/Home.jsx";
import Products from "./pages/product/Products.jsx";
import Login from "./pages/auth/Login.jsx";
import Category from "./pages/category/Category.jsx";
import CreateCategory from "./pages/category/CreateCategory.jsx";
import useAuthCheck from "./hooks/useAuthCheck.js";
import useAuth from "./hooks/useAuth.js";

export default function App() {
  let navigate = useNavigate();
  const authCheck = useAuthCheck();
  return !authCheck ? (
    <>
      <div>Checking auth....</div>
    </>
  ) : (
    <>
      <MainLayout>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          {/* <Route path="categories" element={<Category />} />
              <Route path="categories/add" element={<CreateCategory />} /> */}
          <Route path="categories">
            <Route index element={<Category />} />
            <Route path="add" element={<CreateCategory />} />
          </Route>
        </Routes>
      </MainLayout>
    </>
  );
}
