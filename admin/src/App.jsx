import { useNavigate , Routes, Route } from "react-router";
import React, { useState, useRef, useEffect } from "react";
// import api from "./api/api.js";
import MainLayout from "./components/layout/MainLayout.jsx";
import Home from "./components/home/Home.jsx";
import Products from "./components/products/Products.jsx";
import Login from "./components/login/Login.jsx";

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
