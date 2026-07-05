import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Home,
  Sprout,
  Store,
  User,
  Zap,
  Wallet,
  TrendingUp,
  BookOpen,
  Users,
  Megaphone,
  Bell,
  Shield,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAuth } from "@/contexts/AuthContext";

const primary = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/fields", icon: Sprout, label: "Fields" },
  { to: "/market", icon: Store, label: "Market" },
  { to: "/mining", icon: Zap, label: "Mining" },
  { to: "/wallet", icon: Wallet, label: "Wallet" },
  { to: "/invest", icon: TrendingUp, label: "Invest" },
];

const secondary = [
  { to: "/community", icon: Users, label: "Community" },
  { to: "/education", icon: BookOpen, label: "Education" },
  { to: "/ads", icon: Megaphone, label: "Ads Manager" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/verification", icon: Shield, label: "Verification" },
  { to: "/profile", icon: User, label: "Profile" },
];

const SideNav = () => {
  const { pathname } = useLocation();
  const { isAdmin } = useAdminRole();
  const { user } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Farmer";
  const initials = displayName.slice(0, 2).toUpperCase();

  const item = (to: string, Icon: any, label: string) => {
    const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
    return (
      <NavLink
        key={to}
        to={to}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all",
          active
            ? "gradient-primary text-primary-foreground shadow-premium"
            : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </NavLink>
    );
  };

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-[260px] flex-col border-r border-border/60 bg-card/80 backdrop-blur-xl z-40">
      <div className="p-5 border-b border-border/60">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-premium">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-foreground text-[15px]">Marco Net</h2>
            <p className="text-[10px] text-muted-foreground font-medium">Digital Farming</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Main</p>
        {primary.map((i) => item(i.to, i.icon, i.label))}

        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mt-4 mb-2">More</p>
        {secondary.map((i) => item(i.to, i.icon, i.label))}

        {isAdmin && (
          <>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mt-4 mb-2">Admin</p>
            {item("/admin", ShieldCheck, "Admin Panel")}
          </>
        )}
      </nav>

      <div className="p-3 border-t border-border/60">
        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/60 transition">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-foreground truncate">{displayName}</p>
            <p className="text-[10px] text-muted-foreground truncate">View profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default SideNav;
