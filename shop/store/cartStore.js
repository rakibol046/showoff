import { CART_STORAGE_KEY as CART_KEY } from "@/lib/constants";

export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

// item: { _id, slug, name, image, sell_price, color, size }
export function addToCart(product, quantity = 1, color = null, size = null) {
  const cart = getCart();
  const key = `${product._id}-${color}-${size}`;
  const existing = cart.find((i) => i.key === key);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      key,
      _id: product._id,
      slug: product.slug,
      name: product.name,
      image: product.image || product.images?.[0] || null,
      sell_price: product.sell_price,
      color,
      size,
      quantity,
    });
  }
  saveCart(cart);
}

export function removeFromCart(key) {
  saveCart(getCart().filter((i) => i.key !== key));
}

export function updateQty(key, quantity) {
  if (quantity < 1) return removeFromCart(key);
  saveCart(getCart().map((i) => (i.key === key ? { ...i, quantity } : i)));
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotal(cart) {
  return Math.round(cart.reduce((sum, i) => sum + (i.sell_price ?? 0) * i.quantity, 0) * 100) / 100;
}
