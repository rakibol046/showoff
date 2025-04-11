import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Hash,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export default function HeaderTop() {
  return (
    <div className="px-12 shadow-sm bg-white dark:bg-black lg:flex lg:visible hidden py-1 justify-between items-center border-b-1">
      <div className="wellcome-msg">
        <span className="montserrat">Welcome There!</span>
      </div>
      <div className="social-and-subscribe flex ">
        <div className="social flex gap-3 items-center pr-4 ">
          <a href="#">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#">
            <Youtube className="w-5 h-5" />
          </a>
          <a href="#">
            <Hash className="w-5 h-5" />
          </a>
          <a href="#">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
        <div className="line w-px bg-gray-300 mr-5"></div>
        <Button size={"sm"} className="">
          Subscribe
        </Button>
      </div>
    </div>
  );
}
