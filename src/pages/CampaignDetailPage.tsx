import { ArrowLeft, Pause, Play, Trash2, Eye, MousePointer, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import BottomNav from "@/components/app/BottomNav";
import PageTransition from "@/components/app/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  spend: number;
  daily_budget: number;
  total_budget: number;
  headline: string;
  primary_text: string;
  start_date: string;
  end_date: string | null;
  duration_label: string;
}

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [chartData, setChartData] = useState<{ day: string; clicks: number; impressions: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    const { data } = await supabase.from("ad_campaigns" as any).select("*").eq("id", id).maybeSingle();
    setCampaign(data as any);

    // Build last 7 days chart from ad_events
    const since = new Date(Date.now() - 7 * 86400000);
    const { data: events } = await supabase
      .from("ad_events" as any)
      .select("event_type, created_at")
      .eq("campaign_id", id)
      .gte("created_at", since.toISOString());

    const days: Record<string, { clicks: number; impressions: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toLocaleDateString(undefined, { weekday: "short" });
      days[key] = { clicks: 0, impressions: 0 };
    }
    (events as any[] | null)?.forEach(e => {
      const key = new Date(e.created_at).toLocaleDateString(undefined, { weekday: "short" });
      if (days[key]) {
        if (e.event_type === "click") days[key].clicks++;
        else days[key].impressions++;
      }
    });
    setChartData(Object.entries(days).map(([day, v]) => ({ day, ...v })));
    setLoading(false);
  };

  useEffect(() => {
    load();
    if (!id) return;
    const ch = supabase
      .channel("campaign-" + id)
      .on("postgres_changes", { event: "*", schema: "public", table: "ad_campaigns", filter: `id=eq.${id}` }, load)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ad_events", filter: `campaign_id=eq.${id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading…</div>;
  if (!campaign) return <div className="p-8 text-center text-muted-foreground">Campaign not found</div>;

  const toggleStatus = async () => {
    const next = campaign.status === "active" ? "paused" : "active";
    const { error } = await supabase.from("ad_campaigns" as any).update({ status: next }).eq("id", campaign.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else toast({ title: `Campaign ${next}` });
  };

  const remove = async () => {
    const { error } = await supabase.from("ad_campaigns" as any).delete().eq("id", campaign.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else navigate("/ads");
  };

  const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1) : "0";
  const budgetCap = campaign.total_budget || (campaign.daily_budget * 30);
  const progress = budgetCap > 0 ? Math.min(100, Math.round((campaign.spend / budgetCap) * 100)) : 0;

  const stats = [
    { icon: Eye, label: "Reach", value: campaign.impressions.toLocaleString(), color: "text-primary" },
    { icon: MousePointer, label: "CTR", value: `${ctr}%`, color: "text-accent" },
    { icon: DollarSign, label: "Spend", value: `${campaign.spend} NDC`, color: "text-primary" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <div className="flex items-center gap-3">
            <Link to="/ads"><ArrowLeft className="h-5 w-5 text-foreground" /></Link>
            <h1 className="text-lg font-extrabold text-foreground flex-1">{campaign.name}</h1>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${campaign.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {campaign.status}
            </span>
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-1">
              <p className="font-bold text-sm text-foreground">{campaign.headline}</p>
              {campaign.primary_text && <p className="text-xs text-muted-foreground">{campaign.primary_text}</p>}
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            {stats.map(s => (
              <Card key={s.label} className="border shadow-sm">
                <CardContent className="p-3 text-center">
                  <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                  <p className="text-lg font-extrabold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-bold text-sm text-foreground mb-3">Performance (7 days)</h3>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(150, 37%, 27%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(150, 37%, 27%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="impressions" stroke="hsl(150, 37%, 27%)" strokeWidth={2} fill="url(#clicksGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-foreground">Budget Used</span>
                <span className="text-muted-foreground">{campaign.spend} / {budgetCap} NDC</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground">Daily budget: {campaign.daily_budget} NDC · {campaign.duration_label}</p>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={toggleStatus} variant="outline" className="flex-1 font-bold rounded-xl h-11 gap-2">
              {campaign.status === "active" ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Resume</>}
            </Button>
            <Button variant="destructive" onClick={remove} className="font-bold rounded-xl h-11 gap-2">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default CampaignDetailPage;
