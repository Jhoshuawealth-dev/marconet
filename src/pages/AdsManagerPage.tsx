import { BarChart3, TrendingUp, Eye, MousePointer, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import PageTransition from "@/components/app/PageTransition";

const campaigns = [
  { id: 1, name: "Spring Soy Promo", status: "Active", ctr: "3.2%", spend: "₦12,500", reach: "45K", progress: 65 },
  { id: 2, name: "Maize Investment Drive", status: "Active", ctr: "4.1%", spend: "₦8,200", reach: "32K", progress: 42 },
  { id: 3, name: "Community Awareness", status: "Paused", ctr: "2.8%", spend: "₦5,000", reach: "18K", progress: 80 },
];

const AdsManagerPage = () => (
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

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: BarChart3, label: "Campaigns", value: "3", color: "text-primary" },
            { icon: Eye, label: "Total Reach", value: "95K", color: "text-accent" },
            { icon: MousePointer, label: "Avg CTR", value: "3.4%", color: "text-primary" },
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

        {/* Ad Spend Card */}
        <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated rounded-3xl">
          <CardContent className="p-5">
            <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">Total Ad Spend</p>
            <p className="text-[28px] font-display font-extrabold mt-1 text-metric">₦25,700</p>
            <div className="flex gap-4 mt-2 text-[11px] text-primary-foreground/50">
              <span>This month</span>
              <span className="text-accent font-semibold flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> +24% ROI
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Campaign List */}
        <div>
          <h2 className="font-display font-bold text-foreground text-[15px] mb-3">Current Campaigns</h2>
          <div className="space-y-3">
            {campaigns.map((c) => (
              <Link key={c.id} to={`/ads/${c.id}`}>
                <Card className="border border-border/60 shadow-premium rounded-2xl mb-3">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-[13px] text-foreground">{c.name}</h3>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        c.status === "Active" ? "bg-primary/8 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div className="text-muted-foreground">CTR: <strong className="text-foreground text-metric">{c.ctr}</strong></div>
                      <div className="text-muted-foreground">Spend: <strong className="text-foreground text-metric">{c.spend}</strong></div>
                      <div className="text-muted-foreground">Reach: <strong className="text-foreground text-metric">{c.reach}</strong></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Budget Used</span>
                        <span className="text-metric">{c.progress}%</span>
                      </div>
                      <div className="w-full h-[5px] bg-muted rounded-full overflow-hidden">
                        <div className="h-full gradient-primary rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  </PageTransition>
);

export default AdsManagerPage;
