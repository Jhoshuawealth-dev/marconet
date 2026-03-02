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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {tabs.map((t) => {
          const active = location.pathname === t.to;
          return (
            <NavLink
              key={t.to}
              to={t.to}
              className="flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <t.icon className={cn("h-5 w-5 transition-colors", active ? "text-primary" : "text-muted-foreground")} />
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
