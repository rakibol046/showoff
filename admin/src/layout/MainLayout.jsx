import { Outlet } from "react-router";
import SideNav from "./SideNav";
import TopNav from "./Top";

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
    </div>
  );
}

export default MainLayout;
