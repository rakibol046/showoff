"use client";
import Image from "next/image";
import logo from "@/public/images/logo.svg";
import logoDark from "@/public/images/logo-dark.svg";
import Cart from "./cart";
import { Search, UserRound, Sun, Moon, Menu } from "lucide-react";
import HeaderTop from "./header-top";
import Wishlist from "./wishlist";
import Link from "next/link";

export default function HeaderMobile() {
  return (
    <div className="px-4 md:px-8 shadow-sm bg-white dark:bg-black sticky top-0 left-0 lg:hidden">
      {/* <hr className="my-2" /> */}
      <div className="flex justify-between items-center h-[65px]">
        <Menu />
        <Link href="/">
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
        </Link>
        {/* <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}

        <div className="flex gap-5">
          <Cart />
        </div>
      </div>
    </div>
  );
}
