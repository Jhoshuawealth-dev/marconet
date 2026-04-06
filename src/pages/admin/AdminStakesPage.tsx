import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Users, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StakeData {
  id: string;
  user_id: string;
  project_id: string;
  amount: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
  };
}

interface StakeSummary {
  project_id: string;
  total_staked: number;
  staker_count: number;
  avg_stake: number;
}

const AdminStakesPage = () => {
  const [stakes, setStakes] = useState<StakeData[]>([]);
  const [summaries, setSummaries] = useState<StakeSummary[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all stakes with profile data using manual join
      const { data: stakesData } = await supabase
        .from("staked_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (stakesData) {
        // Get user IDs and fetch profiles separately
        const userIds = [...new Set(stakesData.map(s => s.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", userIds);

        // Create profile map
        const profileMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

        // Combine data
        const stakesWithProfiles = stakesData.map(stake => ({
          ...stake,
          profiles: profileMap.get(stake.user_id) || { full_name: null }
        }));

        setStakes(stakesWithProfiles);

        // Calculate summaries by project
        const projectMap = new Map<string, { total: number; count: number }>();
        stakesWithProfiles.forEach(stake => {
          const current = projectMap.get(stake.project_id) || { total: 0, count: 0 };
          projectMap.set(stake.project_id, {
            total: current.total + stake.amount,
            count: current.count + 1
          });
        });

        const summaryData = Array.from(projectMap.entries()).map(([project_id, data]) => ({
          project_id,
          total_staked: data.total,
          staker_count: data.count,
          avg_stake: Math.round(data.total / data.count)
        })).sort((a, b) => b.total_staked - a.total_staked);

        setSummaries(summaryData);
      }
      setLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel("admin-stakes")
      .on("postgres_changes", { event: "*", schema: "public", table: "staked_projects" }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filteredStakes = stakes.filter(
    (s) =>
      s.project_id.toLowerCase().includes(search.toLowerCase()) ||
      (s.profiles?.full_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0);
  const uniqueProjects = new Set(stakes.map(s => s.project_id)).size;
  const uniqueStakers = new Set(stakes.map(s => s.user_id)).size;

  // Mock chart data - in real app you'd aggregate by date
  const chartData = [
    { date: "Jan", amount: totalStaked * 0.3 },
    { date: "Feb", amount: totalStaked * 0.5 },
    { date: "Mar", amount: totalStaked * 0.7 },
    { date: "Apr", amount: totalStaked * 0.85 },
    { date: "May", amount: totalStaked },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-extrabold text-foreground">Staking Management</h1>
          <p className="text-[12px] text-muted-foreground font-medium mt-1">
            Monitor all staking activity across the platform
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-premium">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-[20px] font-display font-extrabold text-metric">{totalStaked.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Total Staked NDC</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-premium">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-[20px] font-display font-extrabold text-metric">{uniqueProjects}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Active Projects</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-secondary flex items-center justify-center shadow-premium">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-[20px] font-display font-extrabold text-metric">{uniqueStakers}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Active Stakers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="border border-border/60 shadow-premium rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-[15px] font-display font-extrabold">Staking Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px"
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "NDC Staked"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#primaryGradient)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Summaries */}
        <Card className="border border-border/60 shadow-premium rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-[15px] font-display font-extrabold">Top Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summaries.slice(0, 5).map((summary) => (
              <div key={summary.project_id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div>
                  <p className="text-[13px] font-bold text-foreground">{summary.project_id}</p>
                  <p className="text-[10px] text-muted-foreground">{summary.staker_count} stakers</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-metric">{summary.total_staked.toLocaleString()} NDC</p>
                  <p className="text-[10px] text-muted-foreground">avg: {summary.avg_stake.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by project or staker name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 rounded-xl border-border/60 shadow-premium text-[13px]"
          />
        </div>

        {/* Stakes List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-border/60 rounded-2xl animate-pulse">
                <CardContent className="p-4 h-16" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredStakes.map((stake) => (
              <Card key={stake.id} className="border border-border/60 shadow-premium rounded-2xl hover:shadow-elevated transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shadow-sm">
                    {stake.project_id.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{stake.project_id}</p>
                    <p className="text-[10px] text-muted-foreground">
                      by {stake.profiles?.full_name || "Anonymous"} · {new Date(stake.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="gradient-accent text-accent-foreground border-0 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {stake.amount.toLocaleString()} NDC
                  </Badge>
                </CardContent>
              </Card>
            ))}
            {filteredStakes.length === 0 && (
              <Card className="border border-border/60 rounded-2xl">
                <CardContent className="py-12 text-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[12px] text-muted-foreground">No stakes found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStakesPage;