"use client";
import Image from "next/image";
import logo from "@/public/images/logo.svg";
import logoDark from "@/public/images/logo-dark.svg";
import Cart from "./cart";
import { Search, UserRound, Sun, Moon } from "lucide-react";
import HeaderTop from "./header-top";
import Wishlist from "./wishlist";

export default function Header() {
  return (
    <div className="px-12 shadow-sm bg-white dark:bg-black">
      {/* <hr className="my-2" /> */}
      <div className="flex justify-between items-center h-[85px]">
        <div className="relative w-[120px] h-[60px]">
          <Image
            src={logo}
            alt="logo"
            className="object-fill absolute  transition-all  dark:scale-0"
          />
          <Image
            src={logoDark}
            alt="logo"
            className="object-fill absolute scale-0 transition-all  dark:scale-100"
          />
        </div>
        {/* <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}

        <nav>
          <ul className="flex gap-5 font-bold">
            <li>Man</li>
            <li>weman</li>
            <li>Kids</li>
            <li>Screen Care</li>
            <li>NEW ARRIVAL</li>
          </ul>
        </nav>

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
