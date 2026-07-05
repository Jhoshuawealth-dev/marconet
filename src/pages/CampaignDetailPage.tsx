import { ArrowLeft, Pause, Play, Trash2, Eye, MousePointer, DollarSign, Target, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate, Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { useEffect, useState } from "react";
import BottomNav from "@/components/app/BottomNav";
import PageTransition from "@/components/app/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  headline: string;
  primary_text: string;
  start_date: string;
  end_date: string | null;
  duration_label: string;
}

type DayPoint = { day: string; impressions: number; clicks: number; conversions: number; spend: number };

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [chartData, setChartData] = useState<DayPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    const { data } = await supabase.from("ad_campaigns" as any).select("*").eq("id", id).maybeSingle();
    setCampaign(data as any);

    const since = new Date(Date.now() - 7 * 86400000);
    const { data: events } = await supabase
      .from("ad_events" as any)
      .select("event_type, created_at")
      .eq("campaign_id", id)
      .gte("created_at", since.toISOString());

    const days: Record<string, DayPoint> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toLocaleDateString(undefined, { weekday: "short" });
      days[key] = { day: key, impressions: 0, clicks: 0, conversions: 0, spend: 0 };
    }
    (events as any[] | null)?.forEach(e => {
      const key = new Date(e.created_at).toLocaleDateString(undefined, { weekday: "short" });
      if (!days[key]) return;
      if (e.event_type === "click") { days[key].clicks++; days[key].spend += 5; }
      else if (e.event_type === "conversion") { days[key].conversions++; days[key].spend += 10; }
      else { days[key].impressions++; days[key].spend += 1; }
    });
    setChartData(Object.values(days));
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
  const cvr = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) : "0";
  const budgetCap = campaign.total_budget || (campaign.daily_budget * 30);
  const progress = budgetCap > 0 ? Math.min(100, Math.round((campaign.spend / budgetCap) * 100)) : 0;

  const isDepleted = campaign.status === "depleted";
  const statusColor =
    campaign.status === "active" ? "bg-primary/10 text-primary"
    : isDepleted ? "bg-destructive/10 text-destructive"
    : "bg-muted text-muted-foreground";

  const stats = [
    { icon: Eye, label: "Reach", value: campaign.impressions.toLocaleString(), color: "text-primary" },
    { icon: MousePointer, label: "CTR", value: `${ctr}%`, color: "text-accent" },
    { icon: Target, label: "CVR", value: `${cvr}%`, color: "text-primary" },
    { icon: DollarSign, label: "Spend", value: `${campaign.spend} NDC`, color: "text-accent" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        <div className="app-container px-4 pt-6 space-y-5">
          <div className="flex items-center gap-3">
            <Link to="/ads"><ArrowLeft className="h-5 w-5 text-foreground" /></Link>
            <h1 className="text-lg font-extrabold text-foreground flex-1">{campaign.name}</h1>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
              {campaign.status}
            </span>
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-1">
              <p className="font-bold text-sm text-foreground">{campaign.headline}</p>
              {campaign.primary_text && <p className="text-xs text-muted-foreground">{campaign.primary_text}</p>}
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-2">
            {stats.map(s => (
              <Card key={s.label} className="border shadow-sm">
                <CardContent className="p-2.5 text-center">
                  <s.icon className={`h-4 w-4 mx-auto mb-1 ${s.color}`} />
                  <p className="text-[13px] font-extrabold text-foreground">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-foreground">Engagement (7 days)</h3>
                <Button size="sm" variant="outline" onClick={() => exportCSV(
                  `${campaign.name.replace(/\s+/g, "-")}-performance-${new Date().toISOString().slice(0,10)}`,
                  chartData.map(d => ({
                    Day: d.day,
                    Impressions: d.impressions,
                    Clicks: d.clicks,
                    Conversions: d.conversions,
                    CTR_percent: d.impressions > 0 ? +((d.clicks / d.impressions) * 100).toFixed(2) : 0,
                    Spend_NDC: d.spend,
                  }))
                )} className="h-7 rounded-full text-[10px] font-semibold gap-1">
                  <Download className="h-3 w-3" /> CSV
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData} margin={{ left: -20, right: 8, top: 4 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11, border: "1px solid hsl(var(--border))" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} iconSize={8} />
                  <Line type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="clicks" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="conversions" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-bold text-sm text-foreground mb-3">Daily Spend (NDC)</h3>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData} margin={{ left: -20, right: 8, top: 4 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11, border: "1px solid hsl(var(--border))" }} formatter={(v: number) => [`${v} NDC`, "Spend"]} />
                  <Line type="monotone" dataKey="spend" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className={`border shadow-sm ${isDepleted ? "border-destructive/40 bg-destructive/5" : ""}`}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-foreground">Budget Used</span>
                <span className="text-muted-foreground">{campaign.spend} / {budgetCap} NDC</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${isDepleted ? "bg-destructive" : "bg-primary"}`} style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground">Daily budget: {campaign.daily_budget} NDC · {campaign.duration_label}</p>
              {isDepleted && (
                <p className="text-[11px] font-bold text-destructive">
                  Campaign auto-paused — wallet balance or total budget exhausted. Top up to resume.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={toggleStatus} variant="outline" disabled={isDepleted} className="flex-1 font-bold rounded-xl h-11 gap-2">
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
