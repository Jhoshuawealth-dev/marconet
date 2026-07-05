import { NavLink, useLocation } from "react-router-dom";
import { Home, Sprout, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/fields", icon: Sprout, label: "Fields" },
  { to: "/market", icon: Store, label: "Market" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 safe-area-pb">
      <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-around h-[68px]">

        {tabs.map((t) => {
          const active = location.pathname === t.to;
          return (
            <NavLink
              key={t.to}
              to={t.to}
              className="flex flex-col items-center gap-1 px-4 py-1.5 transition-all active:scale-95"
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200",
                active ? "gradient-primary shadow-sm" : ""
              )}>
                <t.icon className={cn("h-[18px] w-[18px] transition-colors", active ? "text-primary-foreground" : "text-muted-foreground")} />
              </div>
              <span className={cn("text-[10px] font-semibold transition-colors", active ? "text-primary" : "text-muted-foreground")}>
                {t.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
