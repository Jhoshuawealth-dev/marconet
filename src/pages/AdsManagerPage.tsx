import { useEffect, useState } from "react";
import { BarChart3, Eye, MousePointer, Plus, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import PageTransition from "@/components/app/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Campaign {
  id: string;
  name: string;
  status: string;
  impressions: number;
  clicks: number;
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
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const avgCtr = totalReach > 0 ? ((totalClicks / totalReach) * 100).toFixed(1) : "0";

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-extrabold text-foreground">Ads Manager</h1>
            <Link to="/ads/create">
              <Button size="sm" className="font-bold text-[11px] h-9 rounded-xl gap-1.5 gradient-primary border-0 shadow-sm">
                <Plus className="h-3.5 w-3.5" /> New Campaign
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BarChart3, label: "Campaigns", value: `${campaigns.length}`, color: "text-primary" },
              { icon: Eye, label: "Total Reach", value: totalReach.toLocaleString(), color: "text-accent" },
              { icon: MousePointer, label: "Avg CTR", value: `${avgCtr}%`, color: "text-primary" },
            ].map((s) => (
              <Card key={s.label} className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-3.5 text-center">
                  <s.icon className={`h-5 w-5 mx-auto mb-1.5 ${s.color}`} />
                  <p className="text-lg font-display font-extrabold text-foreground text-metric">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated rounded-3xl">
            <CardContent className="p-5">
              <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">Total Ad Spend</p>
              <p className="text-[28px] font-display font-extrabold mt-1 text-metric">{totalSpend.toLocaleString()} NDC</p>
              <div className="flex gap-4 mt-2 text-[11px] text-primary-foreground/50">
                <span>All campaigns</span>
              </div>
            </CardContent>
          </Card>

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
                {campaigns.map((c) => (
                  <Link key={c.id} to={`/ads/${c.id}`}>
                    <Card className="border border-border/60 shadow-premium rounded-2xl mb-3">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-[13px] text-foreground">{c.name}</h3>
                          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                            c.status === "active" ? "bg-primary/8 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>{c.impressions.toLocaleString()} views</span>
                          <span>{c.clicks.toLocaleString()} clicks</span>
                          <span>{c.spend.toLocaleString()} NDC spent</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
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
