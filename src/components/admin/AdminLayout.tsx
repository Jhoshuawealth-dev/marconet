import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAdminRole } from "@/hooks/useAdminRole";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  DollarSign,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Moderation", url: "/admin/moderation", icon: MessageSquare },
  { title: "Transactions", url: "/admin/transactions", icon: DollarSign },
];

const superNavItems = [
  { title: "Admin Requests", url: "/admin/requests", icon: ShieldCheck },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { isSuperAdmin } = useAdminRole();

  const allItems = isSuperAdmin ? [...navItems, ...superNavItems] : navItems;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Platform Management</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {allItems.map((item) => {
            const active = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center gap-2 p-3 border-b border-border bg-card">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-sm font-bold text-foreground">Admin Panel</h2>
        </header>

        {/* Mobile nav */}
        <nav className="md:hidden flex overflow-x-auto gap-1 p-2 border-b border-border bg-card">
          {allItems.map((item) => {
            const active = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground bg-muted"
                )}
              >
                <item.icon className="h-3 w-3" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
