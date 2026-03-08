import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Coins, MessageSquare, TrendingUp } from "lucide-react";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ users: 0, totalNdc: 0, pendingPosts: 0, activeStakes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [profilesRes, transactionsRes, postsRes, stakesRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("ndc_transactions").select("amount"),
        supabase.from("community_posts").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("staked_projects").select("id", { count: "exact", head: true }),
      ]);

      const totalNdc = transactionsRes.data?.reduce((sum, t) => sum + (t.amount || 0), 0) ?? 0;

      setStats({
        users: profilesRes.count ?? 0,
        totalNdc,
        pendingPosts: postsRes.count ?? 0,
        activeStakes: stakesRes.count ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Users", value: stats.users, icon: Users, color: "text-primary" },
    { title: "Total NDC Volume", value: stats.totalNdc.toLocaleString(), icon: Coins, color: "text-accent" },
    { title: "Pending Posts", value: stats.pendingPosts, icon: MessageSquare, color: "text-destructive" },
    { title: "Active Stakes", value: stats.activeStakes, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Platform overview and key metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "..." : card.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

// Need cn import
import { cn } from "@/lib/utils";

export default AdminDashboardPage;
