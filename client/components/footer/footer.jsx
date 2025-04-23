import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Hash,
  Linkedin,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import logo from "@/public/images/logo.svg";
import logoDark from "@/public/images/logo-dark.svg";
function Footer() {
  return (
    <div className="px-4 md:px-8 lg:px-12  bg-white dark:bg-black mt-2">
      <div className="h-56 flex justify-center items-center">
        <Image
          src={logo}
          alt="logo"
          className="object-fill h-56 w-72 lg:h-64 lg:w-96 absolute  transition-all  dark:scale-0"
        />
        <Image
          src={logoDark}
          alt="logo"
          className="object-fill h-56 w-72 lg:h-64 lg:w-96 absolute scale-0 transition-all  dark:scale-100"
        />
      </div>

      <div className="hidden lg:flex justify-around my-6">
        <div>
          <p className="font-bold mb-2">Terms & Conditions</p>
          <ul>
            <li>Exchange Policy</li>
            <li>Return & Refund Policy</li>
            <li>Shipping</li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-2">User</p>
          <ul>
            <li>Sign up</li>
            <li>Login</li>
            <li>Contact us</li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-2">About us</p>
          <ul>
            <li>About ShowOff</li>
          </ul>
        </div>
      </div>
      <div className="lg:hidden mb-5">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Terms & Conditions</AccordionTrigger>
            <AccordionContent>
              <ul>
                <li>Exchange Policy</li>
                <li>Return & Refund Policy</li>
                <li>Shipping</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>User</AccordionTrigger>
            <AccordionContent>
              <ul>
                <li>Sign up</li>
                <li>Login</li>
                <li>Contact us</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>About us</AccordionTrigger>
            <AccordionContent>
              <ul>
                <li>About ShowOff</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <hr className="hidden lg:block" />

      <div className="grid grid-cols-1 lg:flex text-center justify-between items-center h-24">
        <div className="flex gap-3 justify-center items-center">
          <a href="#">
            <Facebook />
          </a>
          <a href="#">
            <Instagram />
          </a>
          <a href="#">
            <Twitter />
          </a>
          <a href="#">
            <Youtube />
          </a>
          <a href="#">
            <Hash />
          </a>
          <a href="#">
            <Linkedin />
          </a>
        </div>

        <p className="montserrat">© 2025 ShowOff. Designed By MR ERROR</p>
      </div>
    </div>
  );
}

export default Footer;
