import { Routes, Route, Navigate } from "react-router";
import MainLayout from "./layout/MainLayout.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Products from "./pages/product/Products.jsx";
import CreateProduct from "./pages/product/CreateProduct.jsx";
import EditProduct from "./pages/product/EditProduct.jsx";
import Category from "./pages/category/Category.jsx";
import ColorManagement from "./pages/color/Color.jsx";
import Size from "./pages/size/Size.jsx";
import HeroSlider from "./pages/hero-slider/HeroSlider.jsx";
import Orders from "./pages/orders/Orders.jsx";
import SettingsPage from "./pages/settings/Settings.jsx";
import CreateOrder from "./pages/orders/CreateOrder.jsx";
import Customers from "./pages/customers/Customers.jsx";
import Profile from "./pages/profile/Profile.jsx";
import useAuthCheck from "./hooks/useAuthCheck.js";
import useAuth from "./hooks/useAuth.js";

export default function App() {
  const authChecked = useAuthCheck();
  const isLoggedIn = useAuth();

  if (!authChecked) {
    return <div>Checking auth...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />}
      />

      {isLoggedIn && (
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<CreateProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />

          <Route path="categories" element={<Category />} />

          <Route path="sliders" element={<HeroSlider />} />

          <Route path="sizes" element={<Size />} />
          <Route path="colors" element={<ColorManagement />} />

          <Route path="orders" element={<Orders />} />
          <Route path="orders/create" element={<CreateOrder />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      )}

      {!isLoggedIn && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}
