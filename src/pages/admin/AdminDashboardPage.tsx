import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Coins, MessageSquare, TrendingUp, Activity, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ users: 0, totalNdc: 0, pendingPosts: 0, activeStakes: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentTxs, setRecentTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [profilesRes, transactionsRes, postsRes, stakesRes, recentUsersRes, recentTxsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("ndc_transactions").select("amount"),
        supabase.from("community_posts").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("staked_projects").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("full_name, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("ndc_transactions").select("title, amount, type, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      const totalNdc = transactionsRes.data?.reduce((sum, t) => sum + (t.amount || 0), 0) ?? 0;

      setStats({
        users: profilesRes.count ?? 0,
        totalNdc,
        pendingPosts: postsRes.count ?? 0,
        activeStakes: stakesRes.count ?? 0,
      });
      setRecentUsers(recentUsersRes.data ?? []);
      setRecentTxs(recentTxsRes.data ?? []);
      setLoading(false);
    };

    fetchStats();

    // Set up real-time subscriptions
    const channel = supabase.channel('admin-dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ndc_transactions' }, () => {
        fetchStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        fetchStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'staked_projects' }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const cards = [
    { title: "Total Users", value: stats.users, icon: Users, gradient: "gradient-primary", change: "+12%" },
    { title: "NDC Volume", value: stats.totalNdc.toLocaleString(), icon: Coins, gradient: "gradient-accent", change: "+8.3%" },
    { title: "Pending Posts", value: stats.pendingPosts, icon: MessageSquare, gradient: "gradient-primary", change: "Review" },
    { title: "Active Stakes", value: stats.activeStakes, icon: TrendingUp, gradient: "gradient-accent", change: "+5.2%" },
  ];

  // Simple chart data from recent txs
  const chartData = recentTxs.slice().reverse().map((tx, i) => ({
    name: `T${i + 1}`,
    amount: Math.abs(tx.amount),
  }));

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-display font-extrabold text-foreground">Dashboard</h1>
          <p className="text-[12px] text-muted-foreground font-medium mt-1">Platform overview and key metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {cards.map((card) => (
            <Card key={card.title} className="border border-border/60 shadow-premium rounded-2xl overflow-hidden relative group hover:shadow-elevated transition-shadow">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", card.gradient)}>
                    <card.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {card.change}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-display font-extrabold text-foreground text-metric">
                  {loading ? "..." : card.value}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium mt-1">{card.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Transaction Chart */}
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-foreground text-[14px]">Transaction Volume</h3>
                  <p className="text-[10px] text-muted-foreground font-medium">Recent activity</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(152, 40%, 24%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(152, 40%, 24%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(150, 5%, 42%)' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: 14, fontSize: 12, border: "1px solid hsl(40, 12%, 88%)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", fontFamily: "'DM Sans'" }}
                      formatter={(v: number) => [`${v} NDC`, "Amount"]}
                    />
                    <Area type="monotone" dataKey="amount" stroke="hsl(152, 40%, 24%)" strokeWidth={2.5} fill="url(#adminGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[160px] flex items-center justify-center text-[12px] text-muted-foreground">
                  No transaction data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-foreground text-[14px]">Recent Users</h3>
                  <p className="text-[10px] text-muted-foreground font-medium">Newest members</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-3">
                {recentUsers.length === 0 && !loading && (
                  <p className="text-[12px] text-muted-foreground text-center py-6">No users yet</p>
                )}
                {recentUsers.map((u, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                      {(u.full_name || "U").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-foreground truncate">{u.full_name || "Unnamed"}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Joined {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border border-border/60 shadow-premium rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-foreground text-[14px]">Latest Transactions</h3>
                <p className="text-[10px] text-muted-foreground font-medium">Across all users</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {recentTxs.length === 0 && !loading && (
                <p className="text-[12px] text-muted-foreground text-center py-6">No transactions yet</p>
              )}
              {recentTxs.map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center",
                      tx.amount >= 0 ? "bg-primary/10" : "bg-destructive/10"
                    )}>
                      <Coins className={cn("h-4 w-4", tx.amount >= 0 ? "text-primary" : "text-destructive")} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">{tx.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[13px] font-bold text-metric",
                    tx.amount >= 0 ? "text-primary" : "text-destructive"
                  )}>
                    {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString()} NDC
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
