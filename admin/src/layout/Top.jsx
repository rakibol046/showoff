import account from "../assets/icons/account.svg";
import { Bell, CircleUserRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";
const Header = () => {
  return (
    <div className="w-full shadow flex gap-3 justify-end items-center p-4 pr-10">
      <button className="inline-flex mr-5 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none">
        <span className="relative only:-mx-6">
          <Bell />
          <span className="absolute -top-2 inline-flex items-center justify-center gap-1 rounded-full bg-pink-500 px-1.5 text-xs text-white">
            0<span className="sr-only"> new emails</span>
          </span>
        </span>
      </button>
      <Separator orientation="vertical" />
      <div className="flex gap-1">
        {/* <img src={account} className="h-8 w-8 rounded-full border-2" /> */}
        <CircleUserRound />
        <p className="font-semibold"> Md Rakibul Islam</p>
      </div>
    </div>
  );
};

export default Header;
