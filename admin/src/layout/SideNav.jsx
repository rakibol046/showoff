"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router";
import { adminLogOut } from "../features/auth/authSlice";
import {
  Home,
  Package,
  ShoppingCart,
  List,
  Tags,
  Ruler,
  Palette,
  Users,
  LogOut,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import logo from "@/assets/images/logo.svg";

const menuItem = [
  {
    name: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    url: "/",
  },
  {
    name: "Order",
    icon: <ShoppingCart className="w-5 h-5" />,
    url: "/orders",
    child: [
      { name: "Orders", url: "/orders" },
      { name: "Create Order", url: "/create-order" },
    ],
  },
  {
    name: "Product",
    icon: <Package className="w-5 h-5" />,
    url: "/products",
    child: [
      { name: "Products", url: "/products" },
      { name: "Add Product", url: "/add-product" },
    ],
  },
  {
    name: "Categories",
    icon: <List className="w-5 h-5" />,
    url: "/categories",
    child: [
      { name: "Parent Categories", url: "/parent-categories" },
      { name: "Sub Categories", url: "/sub-categories" },
      { name: "Child Categories", url: "/child-categories" },
    ],
  },
  {
    name: "Brand",
    icon: <Tags className="w-5 h-5" />,
    url: "/brand",
  },
  {
    name: "Size",
    icon: <Ruler className="w-5 h-5" />,
    url: "/size",
  },
  {
    name: "Colors",
    icon: <Palette className="w-5 h-5" />,
    url: "/colors",
  },
  {
    name: "Hero Slider",
    icon: <Package className="w-5 h-5" />,
    url: "/sliders",
    child: [
      { name: "Sliders", url: "/sliders" },
      { name: "Add Slider", url: "/slider/add" },
    ],
  },
];

export default function SideNavigationSeparator() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(adminLogOut());
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <>
      <aside className="flex-one w-72 shadow h-screen flex flex-col">
        <div className="px-6 py-3">
          <img src={logo} alt="logo" />
        </div>
        <nav className="flex-1 overflow-auto px-3">
          <Accordion type="single" collapsible className="space-y-2">
            {menuItem.map((item, index) => (
              <AccordionItem key={index} value={item.name}>
                {item.child ? (
                  <>
                    <AccordionTrigger className="flex items-center gap-2 p-3 rounded group">
                      {item.icon}
                      <span className="flex-1 text-left">{item.name}</span>
                    </AccordionTrigger>
                    <AccordionContent className="ml-6">
                      <ul className="space-y-1">
                        {item.child.map((child, i) => (
                          <li key={i}>
                            <NavLink
                              to={child.url}
                              className={({ isActive }) =>
                                `block p-2 rounded ${
                                  isActive ? "font-bold" : ""
                                }`
                              }
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </>
                ) : (
                  <div className="">
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded ${
                          isActive ? "font-bold" : ""
                        }`
                      }
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </NavLink>
                  </div>
                )}
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded ${
                  isActive ? "font-bold" : ""
                }`
              }
            >
              <Users className="w-5 h-5" />
              <span>User Management</span>
            </NavLink>
          </div>
        </nav>

        <footer className="border-t p-3">
          <button
            onClick={logOut}
            className="flex items-center gap-3 p-3 w-full text-left rounded"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </footer>
      </aside>

      <div
        className={`fixed top-0 bottom-0 left-0 right-0 z-30 transition-colors sm:hidden ${
          isSideNavOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSideNavOpen(false)}
      ></div>
    </>
  );
}
