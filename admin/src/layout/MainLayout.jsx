import { Outlet } from "react-router";
import SideNav from "./SideNav";
import TopNav from "./Top";
import { Toaster } from "@/components/ui/sonner";

function MainLayout() {
  return (
    <div className="flex">
      <div className="flex-one">
        <SideNav />
      </div>
      <div className="w-full shrink">
        <TopNav />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default MainLayout;
