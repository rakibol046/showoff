"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.svg";
import logoDark from "@/public/images/logo-dark.svg";
import Cart from "./cart";
import { UserRound, Menu } from "lucide-react";

export default function HeaderMobile({ categories = [] }) {
  return (
    <div className="px-4 md:px-8 z-50 shadow-sm bg-white dark:bg-black sticky top-0 left-0 lg:hidden">
      <div className="flex justify-between items-center h-[65px]">
        <Menu className="cursor-pointer w-5 h-5" />
        <Link href="/">
          <div className="relative w-[120px] h-[60px]">
            <Image src={logo} alt="logo" className="object-fill absolute transition-all dark:scale-0" />
            <Image src={logoDark} alt="logo" className="object-fill absolute scale-0 transition-all dark:scale-100" />
          </div>
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/auth/login"><UserRound className="w-5 h-5" /></Link>
          <Cart />
        </div>
      </div>
    </div>
  );
}
