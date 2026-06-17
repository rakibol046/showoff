"use client";
import { useState, useEffect } from "react";
import { getCart, addToCart, removeFromCart, updateQty, clearCart, getCartTotal } from "@/store/cartStore";

export default function useCart() {
  const [cart, setCart] = useState([]);

  const sync = () => setCart(getCart());

  useEffect(() => {
    sync();
    window.addEventListener("cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    cart,
    count: cart.reduce((s, i) => s + i.quantity, 0),
    total: getCartTotal(cart),
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
  };
}
