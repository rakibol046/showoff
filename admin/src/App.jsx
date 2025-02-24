import { useNavigate, Routes, Route } from "react-router";
import React, { useState, useRef, useEffect } from "react";
// import api from "./api/api.js";
import MainLayout from "./layout/MainLayout.jsx";
import Home from "./pages/home/Home.jsx";
import Products from "./pages/product/Products.jsx";
import Login from "./pages/auth/Login.jsx";
import Category from "./pages/category/Category.jsx";

export default function App() {
  let navigate = useNavigate();
  // const token = localStorage.getItem("token");
  let token = true;

  // useEffect(async () => {

  // });

  return (
    <>
      {token ? (
        <>
          <MainLayout />
          <main className="lg:ml-72 p-5">
            <Routes>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Category />} />
            </Routes>
          </main>
        </>
      ) : (
        // <Login />
        <Routes>
          <Route path="login" element={<Login />} />
          {/* { navigate("/dashboard")} */}
        </Routes>
      )}
    </>
  );
}
