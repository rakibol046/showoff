import PropTypes from "prop-types";
import { Bell, Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { useGetProfileQuery } from "@/features/auth/authApi";
import { useGetDashboardStatsQuery } from "@/features/dashboard/dashboardApi";
import { imgUrl, onImgError } from "@/lib/imageUrl";

function Avatar({ name, src }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        onError={onImgError}
        className="w-8 h-8 rounded-full object-cover border"
      />
    );
  }

  return (
    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
      {initials}
    </span>
  );
}

Avatar.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
};

const Header = ({ onMenuClick }) => {
  const { data: profile } = useGetProfileQuery();
  const { data: stats } = useGetDashboardStatsQuery();

  const pendingOrders = stats?.orderStats?.pending ?? 0;
  const name = profile?.name || "Admin";
  const picture = profile?.profile_picture ? imgUrl(profile.profile_picture) : null;

  return (
    <header className="w-full border-b bg-background shadow-sm flex items-center justify-between px-4 py-3 gap-3 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1 rounded hover:bg-accent"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Notification bell — badge shows pending orders */}
        <Link
          to="/orders"
          className="relative p-1 rounded hover:bg-accent"
          aria-label="Pending orders"
        >
          <Bell className="w-5 h-5" />
          {pendingOrders > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-0.5 rounded-full bg-pink-500 text-[10px] text-white font-medium">
              {pendingOrders > 99 ? "99+" : pendingOrders}
            </span>
          )}
        </Link>

        <Separator orientation="vertical" className="h-6" />

        <Link to="/profile" className="flex items-center gap-2 hover:text-primary transition-colors">
          <Avatar name={name} src={picture} />
          <span className="font-medium text-sm hidden sm:block">{name}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
