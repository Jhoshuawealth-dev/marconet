import { BarChart3, TrendingUp, Eye, MousePointer, Plus, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";

const campaigns = [
  { id: 1, name: "Spring Soy Promo", status: "Active", ctr: "3.2%", spend: "₦12,500", reach: "45K", progress: 65 },
  { id: 2, name: "Maize Investment Drive", status: "Active", ctr: "4.1%", spend: "₦8,200", reach: "32K", progress: 42 },
  { id: 3, name: "Community Awareness", status: "Paused", ctr: "2.8%", spend: "₦5,000", reach: "18K", progress: 80 },
];

const AdsManagerPage = () => (
  <div className="min-h-screen bg-background pb-20">
    <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-foreground">Ads Manager</h1>
        <Link to="/ads/create">
          <Button size="sm" className="font-bold text-xs h-8 rounded-xl gap-1">
            <Plus className="h-3.5 w-3.5" /> New Campaign
          </Button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: BarChart3, label: "Campaigns", value: "3", color: "text-primary" },
          { icon: Eye, label: "Total Reach", value: "95K", color: "text-accent" },
          { icon: MousePointer, label: "Avg CTR", value: "3.4%", color: "text-primary" },
        ].map((s) => (
          <Card key={s.label} className="border shadow-sm">
            <CardContent className="p-3 text-center">
              <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
              <p className="text-lg font-extrabold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ad Spend Card */}
      <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
        <CardContent className="p-4">
          <p className="text-xs text-primary-foreground/70 font-medium">Total Ad Spend</p>
          <p className="text-2xl font-extrabold mt-1">₦25,700</p>
          <div className="flex gap-4 mt-2 text-xs text-primary-foreground/60">
            <span>This month</span>
            <span className="text-accent font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +24% ROI
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Campaign List */}
      <div>
        <h2 className="font-bold text-foreground text-sm mb-3">Current Campaigns</h2>
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Link key={c.id} to={`/ads/${c.id}`}>
            <Card className="border shadow-sm mb-3">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">{c.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    c.status === "Active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {c.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-muted-foreground">CTR: <strong className="text-foreground">{c.ctr}</strong></div>
                  <div className="text-muted-foreground">Spend: <strong className="text-foreground">{c.spend}</strong></div>
                  <div className="text-muted-foreground">Reach: <strong className="text-foreground">{c.reach}</strong></div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Budget Used</span>
                    <span>{c.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    <BottomNav />
  </div>
);

export default AdsManagerPage;
