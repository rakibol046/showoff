"use client";
import Image from "next/image";
import logo from "@/public/images/logo.svg";
import { ModeToggle } from "./mode-toggle";
import { Cart } from "./cart";

export default function Header() {
  return (
    <>
      <div className="top-header flex gap-2 justify-end py-0.5 px-4">
        <div className="social-link">social link</div>
        <div className="language">language</div>
        <div className="theme">
          <ModeToggle />
        </div>
      </div>

      <div className="main-header  flex gap-3 p-3">
        <div className="logo">
          <Image src={logo} alt="logo" />
        </div>
        <div className="search">search</div>
        <div className="cart">
          <Cart />
        </div>
      </div>
    </>
  );
}
