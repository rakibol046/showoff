import { WISHLIST_STORAGE_KEY as WL_KEY } from "@/lib/constants";

export function getWishlist() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(WL_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWishlist(items) {
  localStorage.setItem(WL_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("wishlist-updated"));
}

// product: { _id, slug, name, image, sell_price }
export function addToWishlist(product) {
  const wl = getWishlist();
  if (!wl.find((i) => i._id === product._id)) {
    saveWishlist([...wl, {
      _id: product._id,
      slug: product.slug,
      name: product.name,
      image: product.image || product.images?.[0] || null,
      sell_price: product.sell_price,
    }]);
  }
}

export function removeFromWishlist(id) {
  saveWishlist(getWishlist().filter((i) => i._id !== id));
}

export function toggleWishlist(product) {
  const wl = getWishlist();
  if (wl.find((i) => i._id === product._id)) {
    removeFromWishlist(product._id);
  } else {
    addToWishlist(product);
  }
}

export function isInWishlist(id) {
  return getWishlist().some((i) => i._id === id);
}
