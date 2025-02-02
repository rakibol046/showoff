
import account from "../assets/icons/account.svg";
const Header = () => {
  return (
    <div className="bg-white w-full flex gap-3 justify-end items-center p-4 pr-10">
      <img src={account} className="h-8 w-8 rounded-full border-2"/>
      <p className="font-semibold"> Md Rakibul Islam</p>
    </div>
  );
};

export default Header;
