const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ROUTES = {
  // Products
  PRODUCTS: `${BASE}/products`,
  PRODUCT_DETAILS: (id) => `${BASE}/products/${id}`,

  //  Cart
  CART: `${BASE}/cart`,
  ADD_TO_CART: `${BASE}/cart/add`,
  REMOVE_FROM_CART: (id) => `${BASE}/cart/remove/${id}`,

  // User Auth
  LOGIN: `${BASE}/auth/login`,
  LOGOUT: `${BASE}/auth/logout`,
  REGISTER: `${BASE}/auth/register`,
  USER_PROFILE: `${BASE}/user/profile`,

  // Orders
  ORDERS: `${BASE}/orders`,
  ORDER_DETAILS: (id) => `${BASE}/orders/${id}`,

  // Wishlist
  WISHLIST: `${BASE}/wishlist`,
  ADD_TO_WISHLIST: `${BASE}/wishlist/add`,
  REMOVE_FROM_WISHLIST: (id) => `${BASE}/wishlist/remove/${id}`,
};
