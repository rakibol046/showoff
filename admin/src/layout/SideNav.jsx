"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Link, useLocation, useNavigate } from "react-router";
import logo from "../assets/images/logo.png";
import home from "../assets/icons/home.svg";
import orders from "../assets/icons/orders.svg";
import products from "../assets/icons/products.svg";
import category from "../assets/icons/category.svg";
import size from "../assets/icons/size.svg";
import colors from "../assets/icons/colors.svg";
import userIcon from "../assets/icons/users.svg";
import logout from "../assets/icons/logout.svg";
import { adminLogOut } from "../features/auth/authSlice";

const menuItem = [
  {
    name: "Dashboard",
    icon: home,
    url: "/",
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
    // child: [
    //   {
    //     name: "Own",
    //     icon: category,
    //     url: "/own-products",
    //   },
    // ],
  },
  {
    name: "Categories",
    icon: category,
    url: "/categories",
    // child: [
    //   {
    //     name: "Main Categories",
    //     icon: category,
    //     url: "/categories",
    //   },
    //   {
    //     name: "Sub Categories",
    //     icon: category,
    //     url: "/sub-categories",
    //   },
    // ],
  },
  {
    name: "Brand",
    icon: category,
    url: "/brand",
  },
  {
    name: "Size",
    icon: size,
    url: "/size",
  },
  {
    name: "Colors",
    icon: colors,
    url: "/colors",
  },
];
export default function SideNavigationSeparator() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const location = useLocation();
  let navigate = useNavigate();

  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(adminLogOut());
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <>
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
          className="flex-1 divide-y divide-[#454545] overflow-auto"
        >
          <div>
            <ul className="flex flex-1 flex-col gap-1 py-3">
              {menuItem.map((item, index) => (
                <div>
                  {item?.child?.length > 0 ? (
                    <details className="group px-3 font-medium rounded">
                      <summary
                        className={`relative hover:bg-[#303030] rounded p-3 flex justify-center items-center gap-3 cursor-pointer list-none pr-8 font-medium  transition-colors duration-300 focus-visible:outline-none  [&::-webkit-details-marker]:hidden ${
                          location.pathname === item.url ||
                          location.pathname === "/sub-categories"
                            ? "bg-[#303030]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center self-center">
                          <img src={item.icon} className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                          {item.name}
                        </div>
                        <svg
                          className="absolute right-0 top-3 h-8 w-8 shrink-0  transition duration-300 group-open:rotate-90"
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#FFFFFF"
                        >
                          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                        </svg>
                      </summary>
                      <ul className="mt-2">
                        {item?.child?.map((child, index) => (
                          <li key={index} className="p-2">
                            <NavLink
                              to={child.url}
                              className={({ isActive }) =>
                                isActive
                                  ? "text-emerald-500  font-bold"
                                  : "flex items-center  hover:font-bold"
                              }
                            >
                              <div className="flex pl-10 w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                                {child.name}
                              </div>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <li key={index} className="px-3 font-medium">
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-content  flex items-center gap-3 rounded p-3  transition-colors hover:bg-emerald-50 hover:text-emerald-500"
                            : "flex items-center gap-3 rounded p-3  transition-colors hover:bg-[#303030]"
                        }
                      >
                        <div className="flex items-center self-center">
                          <img src={item.icon} className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                          {item.name}
                        </div>
                      </NavLink>
                    </li>
                  )}
                </div>
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
                  }
                >
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
        <footer className="border-t border-[#454545] p-3">
          <button
            onClick={logOut}
            className="flex items-center gap-3 rounded p-3  transition-colors hover:text-emerald-500 "
          >
            <div className="flex items-center self-center ">
              <img src={logout} className="h-8 w-8" />
            </div>
            <div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm font-medium">
              Logout
            </div>
          </button>
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
