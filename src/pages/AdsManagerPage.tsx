import { useEffect, useState } from "react";
import { BarChart3, Eye, MousePointer, Plus, Inbox, Target, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import PageTransition from "@/components/app/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { exportCSV } from "@/lib/csvExport";

interface Campaign {
  id: string;
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  daily_budget: number;
  total_budget: number;
}

const AdsManagerPage = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("ad_campaigns" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setCampaigns((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    if (!user) return;
    const ch = supabase
      .channel("ad-campaigns-" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "ad_campaigns", filter: `user_id=eq.${user.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const totalReach = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + (c.conversions || 0), 0);
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const avgCtr = totalReach > 0 ? ((totalClicks / totalReach) * 100).toFixed(1) : "0";
  const avgCvr = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0";

  // Per-campaign chart data
  const perCampaign = campaigns.slice(0, 8).map(c => ({
    name: c.name.length > 10 ? c.name.slice(0, 10) + "…" : c.name,
    Impressions: c.impressions,
    Clicks: c.clicks,
    Conversions: c.conversions || 0,
    Spend: c.spend,
  }));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="app-container px-5 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-extrabold text-foreground">Ads Manager</h1>
            <Link to="/ads/create">
              <Button size="sm" className="font-bold text-[11px] h-9 rounded-xl gap-1.5 gradient-primary border-0 shadow-sm">
                <Plus className="h-3.5 w-3.5" /> New Campaign
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: BarChart3, label: "Campaigns", value: `${campaigns.length}`, color: "text-primary" },
              { icon: Eye, label: "Reach", value: totalReach.toLocaleString(), color: "text-accent" },
              { icon: MousePointer, label: "CTR", value: `${avgCtr}%`, color: "text-primary" },
              { icon: Target, label: "CVR", value: `${avgCvr}%`, color: "text-accent" },
            ].map((s) => (
              <Card key={s.label} className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-2.5 text-center">
                  <s.icon className={`h-4 w-4 mx-auto mb-1 ${s.color}`} />
                  <p className="text-[13px] font-display font-extrabold text-foreground text-metric">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated rounded-3xl">
            <CardContent className="p-5">
              <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">Total Ad Spend</p>
              <p className="text-[28px] font-display font-extrabold mt-1 text-metric">{totalSpend.toLocaleString()} NDC</p>
              <div className="flex gap-4 mt-2 text-[11px] text-primary-foreground/60">
                <span>{totalConversions} conversions</span>
                <span>·</span>
                <span>{totalClicks} clicks</span>
              </div>
            </CardContent>
          </Card>

          {perCampaign.length > 0 && (
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-foreground text-[13px]">Performance by campaign</h3>
                  <Button size="sm" variant="outline" onClick={() => exportCSV(
                    `campaigns-performance-${new Date().toISOString().slice(0,10)}`,
                    campaigns.map(c => ({
                      Campaign: c.name,
                      Status: c.status,
                      Impressions: c.impressions,
                      Clicks: c.clicks,
                      Conversions: c.conversions || 0,
                      CTR_percent: c.impressions > 0 ? +((c.clicks / c.impressions) * 100).toFixed(2) : 0,
                      Spend_NDC: c.spend,
                      Daily_Budget_NDC: c.daily_budget,
                      Total_Budget_NDC: c.total_budget,
                    }))
                  )} className="h-7 rounded-full text-[10px] font-semibold gap-1">
                    <Download className="h-3 w-3" /> CSV
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={perCampaign} margin={{ left: -20, right: 4, top: 4 }}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11, border: "1px solid hsl(var(--border))" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconSize={8} />
                    <Bar dataKey="Impressions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Clicks" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Conversions" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className="font-display font-bold text-foreground text-[15px] mb-3">Current Campaigns</h2>
            {loading ? (
              <p className="text-[12px] text-muted-foreground text-center py-6">Loading…</p>
            ) : campaigns.length === 0 ? (
              <Card className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-8 text-center">
                  <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-[13px] font-semibold text-foreground">No campaigns yet</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Create your first ad campaign to reach farmers and investors.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c) => {
                  const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(1) : "0";
                  const cap = c.total_budget || c.daily_budget * 30;
                  const pct = cap > 0 ? Math.min(100, Math.round((c.spend / cap) * 100)) : 0;
                  const depleted = c.status === "depleted";
                  return (
                    <Link key={c.id} to={`/ads/${c.id}`}>
                      <Card className="border border-border/60 shadow-premium rounded-2xl mb-3">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display font-bold text-[13px] text-foreground">{c.name}</h3>
                            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                              c.status === "active" ? "bg-primary/8 text-primary"
                              : depleted ? "bg-destructive/10 text-destructive"
                              : "bg-muted text-muted-foreground"
                            }`}>
                              {c.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
                            <div><span className="font-bold text-foreground">{c.impressions}</span><div>views</div></div>
                            <div><span className="font-bold text-foreground">{c.clicks}</span><div>clicks</div></div>
                            <div><span className="font-bold text-foreground">{c.conversions || 0}</span><div>conv.</div></div>
                            <div><span className="font-bold text-foreground">{ctr}%</span><div>CTR</div></div>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${depleted ? "bg-destructive" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{c.spend} / {cap} NDC</span>
                            {depleted && <span className="text-destructive font-bold">Auto-paused</span>}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default AdsManagerPage;
