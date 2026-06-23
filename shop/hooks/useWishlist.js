"use client";
import { useState, useEffect } from "react";
import { getWishlist, toggleWishlist, removeFromWishlist, isInWishlist } from "@/store/wishlistStore";

export default function useWishlist() {
  const [wishlist, setWishlist] = useState([]);

  const sync = () => setWishlist(getWishlist());

  useEffect(() => {
    sync();
    window.addEventListener("wishlist-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("wishlist-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    wishlist,
    count: wishlist.length,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist: (id) => isInWishlist(id),
  };
}
