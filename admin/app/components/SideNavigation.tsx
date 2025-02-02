import React, { useState } from "react";
import { Link, useLocation } from "react-router";

import logo from "../assets/images/logo.png"
import home from "../assets/icons/home.svg";
import orders from "../assets/icons/orders.svg";
import products from "../assets/icons/products.svg";
import category from "../assets/icons/category.svg";
import size from "../assets/icons/size.svg";
import colors from "../assets/icons/colors.svg";
import userIcon from "../assets/icons/users.svg";
import logout from "../assets/icons/logout.svg";

const menuItem = [
  { name: "Dashboard", icon: home, url: "/" },
  { name: "Orders", icon: orders, url: "/orders" },
  { name: "Products", icon: products, url: "/products" },
  { name: "Categories", icon: category, url: "/categories" },
  { name: "Size", icon: size, url: "/size" },
  { name: "Colors", icon: colors, url: "/colors" },
];

export default function SideNavigationSeparator() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { pathname } = useLocation(); // Get current path

  return (
    <>
      {/* Mobile trigger */}
      <button
        title="Side navigation"
        type="button"
        className={`fixed left-6 top-6 z-40 h-10 w-10 rounded bg-white lg:hidden ${
          isSideNavOpen ? "opacity-100" : "opacity-50"
        }`}
        aria-haspopup="menu"
        aria-expanded={isSideNavOpen}
        aria-controls="nav-menu"
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
      >
        <div className="relative w-6 h-6 flex flex-col justify-between">
          <span className="block h-0.5 bg-gray-700 transition-transform" />
          <span className="block h-0.5 bg-gray-700 transition-transform" />
          <span className="block h-0.5 bg-gray-700 transition-transform" />
        </div>
      </button>

      {/* Side Navigation */}
      <aside
        id="nav-menu"
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transition-transform lg:translate-x-0 ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 p-6 text-xl font-medium">
          <img src={logo} alt="Logo" className="h-10" />
        </Link>

        <nav className="flex-1 divide-y divide-gray-100 overflow-auto">
          <ul className="flex flex-col gap-1 py-3">
            {menuItem.map((item) => (
              <li key={item.url} className="px-3 font-medium">
                <Link
                  to={item.url}
                  className={`flex items-center gap-3 rounded p-3 transition-colors ${
                    pathname === item.url ? "bg-emerald-50 text-emerald-500" : "text-gray-700"
                  } hover:bg-emerald-50 hover:text-emerald-500`}
                >
                  <img src={item.icon} alt={item.name} className="h-8 w-8" />
                  <span className="truncate text-sm">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* User Management */}
          <ul className="flex flex-col gap-1 py-3">
            <li className="px-3 font-medium">
              <Link
                to="/users"
                className={`flex items-center gap-3 rounded p-3 transition-colors ${
                  pathname === "/users" ? "bg-emerald-50 text-emerald-500" : "text-gray-700"
                } hover:bg-emerald-50 hover:text-emerald-500`}
              >
                <img src={userIcon} alt="User Management" className="h-8 w-8" />
                <span className="truncate text-sm">User Management</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer - Logout */}
        <footer className="border-t border-gray-200 p-3">
          <Link
            to="/logout"
            className="flex items-center gap-3 p-3 text-gray-900 hover:text-emerald-500"
          >
            <img src={logout} alt="Logout" className="h-8 w-8" />
            <span className="truncate text-sm font-medium">Logout</span>
          </Link>
        </footer>
      </aside>

      {/* Backdrop */}
      {isSideNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/20 sm:hidden"
          onClick={() => setIsSideNavOpen(false)}
        ></div>
      )}
    </>
  );
}
