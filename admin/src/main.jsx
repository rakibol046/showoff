import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./globals.css";
import MainLayout from "./components/layout/MainLayout.jsx";
import Home from "./components/home/Home.jsx";
import Products from "./components/products/Products.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MainLayout />
      <main className="lg:ml-72 p-5">
        <Routes>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
        </Routes>
      </main>
    </BrowserRouter>
  </StrictMode>
);
