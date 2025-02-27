import SideNav from "./SideNav";
import TopNav from "./Top";

function MainLayout({ children }) {
  return (
    <>
      <SideNav />
      <TopNav />
      <main className="lg:ml-72 p-5">{children}</main>
    </>
  );
}
export default MainLayout;
