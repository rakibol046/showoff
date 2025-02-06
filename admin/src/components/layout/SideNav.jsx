"use client";
import React, { useState } from "react";
import { NavLink, Link } from "react-router";
import logo from "../../assets/images/logo.png";
import home from "../../assets/icons/home.svg";
import orders from "../../assets/icons/orders.svg";
import products from "../../assets/icons/products.svg";
import category from "../../assets/icons/category.svg";
import size from "../../assets/icons/size.svg";
import colors from "../../assets/icons/colors.svg";
import userIcon from "../../assets/icons/users.svg";
import logout from "../../assets/icons/logout.svg";

const menuItem = [
  {
    name: "Dashboard",
    icon: home,
    url: "/",
    child: [],
  },
  {
    name: "Orders",
    icon: orders,
    url: "/orders",
    child: [],
  },
  {
    name: "Products",
    icon: products,
    url: "/products",
    child: [],
  },
  {
    name: "Categories",
    icon: category,
    url: "/categories",
    child: [],
  },
  {
    name: "Size",
    icon: size,
    url: "/size",
    child: [],
  },
  {
    name: "Colors",
    icon: colors,
    url: "/colors",
    child: [],
  },
];
export default function SideNavigationSeparator() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  return (
    <>
      {/*  <!-- Component: Side navigation menu with content separator --> */}
      {/*  <!-- Mobile trigger --> */}
      <button
        title="Side navigation"
        type="button"
        className={`visible fixed left-4 top-4 z-40 order-10 block h-10 w-10 self-center rounded bg-white opacity-100 lg:hidden ${
          isSideNavOpen
            ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
            : ""
        }`}
        aria-haspopup="menu"
        aria-label="Side navigation"
        aria-expanded={isSideNavOpen ? " true" : "false"}
        aria-controls="nav-menu-2"
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
      >
        <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-700 transition-all duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
          ></span>
        </div>
      </button>

      {/*  <!-- Side Navigation --> */}
      <aside
        id="nav-menu-2"
        aria-label="Side navigation"
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col  bg-main transition-transform lg:translate-x-0 ${
          isSideNavOpen ? "translate-x-0" : " -translate-x-full"
        }`}
      >
        <Link
          aria-label="WindUI logo"
          className="flex items-center gap-2 whitespace-nowrap p-6 text-xl font-medium focus:outline-none"
          to="javascript:void(0)"
        >
          <img src={logo} />
        </Link>
        <nav
          aria-label="side navigation"
          className="flex-1 divide-y  overflow-auto"
          style={{ borderColor: "red" }}
        >
          <div>
            <ul className="flex flex-1 flex-col gap-1 py-3">
              {menuItem.map((item, index) => (
                <li key={index} className="px-3 font-medium">
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      isActive
                        ? "bg-content  flex items-center gap-3 rounded p-3  transition-colors hover:bg-emerald-50 hover:text-emerald-500"
                        : "flex items-center gap-3 rounded p-3  transition-colors hover:bg-[#303030]"
                    }
                    // className={` ${({ isActive }) =>
                    //   isActive
                    //     ? "text-emerald-500 bg-emerald-50"
                    //     : "text-slate-700"} flex items-center gap-3 rounded p-3  transition-colors hover:bg-emerald-50 hover:text-emerald-500`
                    //   }
                  >
                    <div className="flex items-center self-center">
                      <img src={item.icon} className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                      {item.name}
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="flex flex-1 flex-col gap-1 py-3">
              <li className="px-3 font-medium">
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                      isActive
                        ? "bg-content  flex items-center gap-3 rounded p-3  transition-colors hover:bg-emerald-50 hover:text-emerald-500"
                        : "flex items-center gap-3 rounded p-3  transition-colors hover:bg-[#303030]"
                    }            >
                  <img src={userIcon} className="h-8 w-8" />
                  <div className="flex items-center self-center "></div>
                  <div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm ">
                    User Management
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <footer className="border-t border-red-100 p-3">
          <Link
            to="#"
            className="flex items-center gap-3 rounded p-3  transition-colors hover:text-emerald-500 "
          >
            <div className="flex items-center self-center ">
              <img src={logout} className="h-8 w-8" />
            </div>
            <div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm font-medium">
              Logout
            </div>
          </Link>
        </footer>
      </aside>

      {/*  <!-- Backdrop --> */}
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 z-30 bg-slate-900/20 transition-colors sm:hidden ${
          isSideNavOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSideNavOpen(false)}
      ></div>
      {/*  <!-- End Side navigation menu with content separator --> */}
    </>
  );
}
