import { BarChart3, TrendingUp, Eye, MousePointer, Plus, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import PageTransition from "@/components/app/PageTransition";

const AdsManagerPage = () => {
  // No dummy campaigns - will be populated from real data later
  const campaigns: any[] = [];

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

          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BarChart3, label: "Campaigns", value: `${campaigns.length}`, color: "text-primary" },
              { icon: Eye, label: "Total Reach", value: "0", color: "text-accent" },
              { icon: MousePointer, label: "Avg CTR", value: "0%", color: "text-primary" },
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
              <p className="text-[28px] font-display font-extrabold mt-1 text-metric">₦0</p>
              <div className="flex gap-4 mt-2 text-[11px] text-primary-foreground/50">
                <span>This month</span>
              </div>
            </CardContent>
          </Card>

          {/* Campaign List */}
          <div>
            <h2 className="font-display font-bold text-foreground text-[15px] mb-3">Current Campaigns</h2>
            {campaigns.length === 0 ? (
              <Card className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-8 text-center">
                  <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-[13px] font-semibold text-foreground">No campaigns yet</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Create your first ad campaign to reach farmers and investors.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c: any) => (
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
