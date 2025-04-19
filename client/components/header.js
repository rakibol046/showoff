"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.svg";
import logoDark from "@/public/images/logo-dark.svg";
import Cart from "./cart";
import { Search, UserRound } from "lucide-react";
import HeaderTop from "./header-top";
import Wishlist from "./wishlist";
import { Menu } from "./navigation-menu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname(); // ✅ Get current route

  useEffect(() => {
    if (pathname !== "/") return; // ✅ Only apply scroll logic on home

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <div
      className={`sticky top-0 left-0 hidden lg:block w-full z-50 px-12 transition-all duration-300 items-center ${
        isHome
          ? isScrolled
            ? "bg-white dark:bg-black shadow-sm"
            : "bg-transparent"
          : "bg-white dark:bg-black shadow-sm"
      }`}
    >
      <div className="flex justify-between items-center h-[85px]">
        <div className="relative w-[120px] h-[60px]">
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              className="object-fill absolute transition-all dark:scale-0"
            />
            <Image
              src={logoDark}
              alt="logo"
              className="object-fill absolute scale-0 transition-all dark:scale-100"
            />
          </Link>
        </div>

        <Menu />

        {/* <nav>
          <ul className="flex gap-5 font-bold">
            <li>
              <Link href="/products">Man</Link>
            </li>
            <li>Weman</li>
            <li>Kids</li>
            <li>Screen Care</li>
            <li>NEW ARRIVAL</li>
          </ul>
        </nav> */}

        <div className="flex gap-5">
          <Search />
          <UserRound />
          <Wishlist />
          <Cart />
        </div>
      </div>
    </div>
  );
}
