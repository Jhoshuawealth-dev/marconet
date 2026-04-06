import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  DollarSign,
  ShieldCheck,
  ArrowLeft,
  Settings,
  Bell,
  TrendingUp,
  BookOpen,
  BarChart3,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Moderation", url: "/admin/moderation", icon: MessageSquare },
  { title: "Transactions", url: "/admin/transactions", icon: DollarSign },
  { title: "Stakes", url: "/admin/stakes", icon: TrendingUp },
  { title: "Education", url: "/admin/education", icon: BookOpen },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "Announcements", url: "/admin/announcements", icon: Bell },
  { title: "Verification", url: "/admin/verification", icon: FileCheck },
];

const superNavItems = [
  { title: "Admin Requests", url: "/admin/requests", icon: ShieldCheck },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { isSuperAdmin } = useAdminRole();
  const { user } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();

  const allItems = isSuperAdmin ? [...navItems, ...superNavItems] : navItems;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — Desktop */}
      <aside className="w-[260px] border-r border-border/60 bg-card hidden md:flex flex-col shadow-premium">
        {/* Logo / Brand */}
        <div className="p-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-premium">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-foreground text-[15px]">Admin Panel</h2>
              <p className="text-[10px] text-muted-foreground font-medium">Marco Net Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Main Menu</p>
          {navItems.map((item) => {
            const active = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all",
                  active
                    ? "gradient-primary text-primary-foreground shadow-premium"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}

          {isSuperAdmin && (
            <>
              <div className="pt-3 pb-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Super Admin</p>
              </div>
              {superNavItems.map((item) => {
                const active = location.pathname === item.url;
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all",
                      active
                        ? "gradient-primary text-primary-foreground shadow-premium"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Profile + Back */}
        <div className="p-3 border-t border-border/60 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-foreground truncate">{displayName}</p>
              <p className="text-[10px] text-muted-foreground">{isSuperAdmin ? "Super Admin" : "Admin"}</p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border/60 bg-card shadow-premium">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="w-9 h-9 rounded-xl bg-muted/80 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-extrabold text-foreground text-[14px]">Admin</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
            {initials}
          </div>
        </header>

        {/* Mobile Nav */}
        <nav className="md:hidden flex overflow-x-auto gap-2 p-3 border-b border-border/60 bg-card/80 backdrop-blur-sm">
          {allItems.map((item) => {
            const active = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all",
                  active
                    ? "gradient-primary text-primary-foreground shadow-premium"
                    : "text-muted-foreground bg-muted/60"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
