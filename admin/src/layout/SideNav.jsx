import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { adminLogOut } from "../features/auth/authSlice";
import {
  Home, Package, ShoppingCart, List, Ruler,
  Palette, Users, LogOut, Image, User, X, ChevronDown, Settings,
} from "lucide-react";
import logo from "@/assets/images/logo.svg";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", icon: Home, url: "/" },
  {
    name: "Orders",
    icon: ShoppingCart,
    url: "/orders",
    child: [
      { name: "All Orders", url: "/orders" },
      { name: "Create Order", url: "/orders/create" },
    ],
  },
  {
    name: "Products",
    icon: Package,
    url: "/products",
    child: [
      { name: "All Products", url: "/products" },
      { name: "Add Product", url: "/add-product" },
    ],
  },
  { name: "Categories", icon: List, url: "/categories" },
  { name: "Sizes", icon: Ruler, url: "/sizes" },
  { name: "Colors", icon: Palette, url: "/colors" },
  { name: "Hero Sliders", icon: Image, url: "/sliders" },
  { name: "Customers", icon: Users, url: "/customers" },
  { name: "Settings", icon: Settings, url: "/settings" },
  { name: "Profile", icon: User, url: "/profile" },
];

function NavItem({ item, onClose }) {
  const [open, setOpen] = useState(false);

  if (item.child) {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
        >
          <item.icon className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left">{item.name}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <ul className="ml-7 mt-1 space-y-1 border-l pl-3">
            {item.child.map((child) => (
              <li key={child.url}>
                <NavLink
                  to={child.url}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-accent"
                    }`
                  }
                >
                  {child.name}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.url}
      end={item.url === "/"}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent"
        }`
      }
    >
      <item.icon className="w-4 h-4 shrink-0" />
      <span>{item.name}</span>
    </NavLink>
  );
}

export default function SideNav({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(adminLogOut());
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-background border-r flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:z-auto
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b shrink-0">
        <img src={logo} alt="Showoff Admin" className="h-8" />
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded hover:bg-accent"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavItem key={item.url} item={item} onClose={onClose} />
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t p-3 shrink-0">
        <button
          onClick={logOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium hover:bg-accent transition-colors text-red-600 hover:text-red-700"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
