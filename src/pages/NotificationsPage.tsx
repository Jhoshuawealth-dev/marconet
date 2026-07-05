import { ArrowLeft, Bell, CheckCheck, Megaphone, Heart, MessageCircle, TrendingUp, Shield, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import PageTransition from "@/components/app/PageTransition";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  announcement: Megaphone,
  post_approval: Heart,
  stake_maturity: TrendingUp,
  system: Shield,
  comment: MessageCircle,
};

const NotificationsPage = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        <div className="app-container px-4 pt-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/dashboard"><ArrowLeft className="h-5 w-5 text-foreground" /></Link>
              <h1 className="text-xl font-extrabold text-foreground">Notifications</h1>
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-[11px] text-primary font-bold gap-1">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </Button>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border animate-pulse"><CardContent className="p-4 h-16" /></Card>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <Card className="border shadow-sm">
              <CardContent className="p-8 text-center">
                <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-semibold text-foreground">No notifications yet</p>
                <p className="text-xs text-muted-foreground mt-1">You'll see activity updates here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => {
                const Icon = iconMap[n.type] || Coins;
                return (
                  <Card
                    key={n.id}
                    className={cn("border shadow-sm cursor-pointer transition-colors", !n.read && "border-primary/30 bg-primary/5")}
                    onClick={() => !n.read && markAsRead(n.id)}
                  >
                    <CardContent className="p-3 flex items-start gap-3">
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", n.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary")}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-bold truncate", n.read ? "text-muted-foreground" : "text-foreground")}>{n.title}</p>
                        {n.body && <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>}
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(n.created_at).toLocaleDateString()} · {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default NotificationsPage;
