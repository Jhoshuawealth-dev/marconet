import { ArrowLeft, Pause, Play, Trash2, TrendingUp, Eye, MousePointer, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import BottomNav from "@/components/app/BottomNav";
import PageTransition from "@/components/app/PageTransition";

const campaignData: Record<string, any> = {
  "1": { name: "Spring Soy Promo", status: "Active", ctr: "3.2%", spend: "₦12,500", reach: "45K", progress: 65, budget: "₦20,000", clicks: 1440, impressions: 45000 },
  "2": { name: "Maize Investment Drive", status: "Active", ctr: "4.1%", spend: "₦8,200", reach: "32K", progress: 42, budget: "₦20,000", clicks: 1312, impressions: 32000 },
  "3": { name: "Community Awareness", status: "Paused", ctr: "2.8%", spend: "₦5,000", reach: "18K", progress: 80, budget: "₦6,250", clicks: 504, impressions: 18000 },
};

const chartData = [
  { day: "Mon", clicks: 180, impressions: 5200 },
  { day: "Tue", clicks: 220, impressions: 6100 },
  { day: "Wed", clicks: 195, impressions: 5800 },
  { day: "Thu", clicks: 260, impressions: 7200 },
  { day: "Fri", clicks: 310, impressions: 8400 },
  { day: "Sat", clicks: 280, impressions: 7800 },
  { day: "Sun", clicks: 340, impressions: 9100 },
];

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = campaignData[id || "1"];
  const [status, setStatus] = useState(campaign?.status || "Active");

  if (!campaign) return <div className="p-8 text-center text-muted-foreground">Campaign not found</div>;

  const toggleStatus = () => setStatus(s => s === "Active" ? "Paused" : "Active");

  const stats = [
    { icon: Eye, label: "Reach", value: campaign.reach, color: "text-primary" },
    { icon: MousePointer, label: "CTR", value: campaign.ctr, color: "text-accent" },
    { icon: DollarSign, label: "Spend", value: campaign.spend, color: "text-primary" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <div className="flex items-center gap-3">
            <Link to="/ads"><ArrowLeft className="h-5 w-5 text-foreground" /></Link>
            <h1 className="text-lg font-extrabold text-foreground flex-1">{campaign.name}</h1>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status === "Active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {status}
            </span>
          </div>

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

          {/* Performance chart */}
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
                  <Area type="monotone" dataKey="clicks" stroke="hsl(150, 37%, 27%)" strokeWidth={2} fill="url(#clicksGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Budget progress */}
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-foreground">Budget Used</span>
                <span className="text-muted-foreground">{campaign.spend} / {campaign.budget}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${campaign.progress}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground">{campaign.progress}% of budget consumed</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={toggleStatus} variant="outline" className="flex-1 font-bold rounded-xl h-11 gap-2">
              {status === "Active" ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Resume</>}
            </Button>
            <Button variant="destructive" onClick={() => navigate("/ads")} className="font-bold rounded-xl h-11 gap-2">
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
