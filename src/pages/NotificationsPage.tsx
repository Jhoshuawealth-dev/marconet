import { ArrowLeft, Heart, MessageCircle, Share2, Coins, Pickaxe, GraduationCap, Sprout, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import { useNdc } from "@/contexts/NdcContext";
import PageTransition from "@/components/app/PageTransition";

const iconMap: Record<string, any> = {
  "Like Reward": Heart,
  "Comment Reward": MessageCircle,
  "Share Reward": Share2,
  "Mining Reward": Pickaxe,
  "Course Enrollment": GraduationCap,
  "Post Approved": Sprout,
  "Picture Upload Reward": Sprout,
  "Video Upload Reward": Sprout,
};

const colorMap: Record<string, string> = {
  earn: "text-primary bg-primary/10",
  spend: "text-destructive bg-destructive/10",
};

const NotificationsPage = () => {
  const { transactions } = useNdc();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <div className="flex items-center gap-3">
            <Link to="/dashboard"><ArrowLeft className="h-5 w-5 text-foreground" /></Link>
            <h1 className="text-xl font-extrabold text-foreground">Notifications</h1>
          </div>

          {transactions.length === 0 ? (
            <Card className="border shadow-sm">
              <CardContent className="p-8 text-center">
                <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-semibold text-foreground">No notifications yet</p>
                <p className="text-xs text-muted-foreground mt-1">Start mining, posting, or investing to see activity here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => {
                const Icon = iconMap[tx.title] || Coins;
                const colors = colorMap[tx.type];
                return (
                  <Card key={tx.id} className="border shadow-sm">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{tx.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{tx.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-xs font-extrabold ${tx.type === "earn" ? "text-primary" : "text-destructive"}`}>
                          {tx.type === "earn" ? "+" : "-"}{tx.amount} NDC
                        </p>
                        <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                      </div>
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
