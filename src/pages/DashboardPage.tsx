import { Bell, TrendingUp, ArrowUpRight, Zap, Leaf, Wallet, Users, BookOpen, Megaphone, Shield, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { useNdc } from "@/contexts/NdcContext";
import PageTransition from "@/components/app/PageTransition";

const yieldData = [
  { day: "Mon", ndc: 120 }, { day: "Tue", ndc: 180 }, { day: "Wed", ndc: 150 },
  { day: "Thu", ndc: 220 }, { day: "Fri", ndc: 280 }, { day: "Sat", ndc: 250 }, { day: "Sun", ndc: 310 },
];

const activeFields = [
  { name: "Green Valley Soy", maturity: 72, apr: "18.5%", status: "Growing", ndc: "2,400" },
  { name: "Sunrise Maize Field", maturity: 45, apr: "22.0%", status: "Active", ndc: "1,200" },
  { name: "Cassava Digital Farm", maturity: 90, apr: "15.2%", status: "Harvest Ready", ndc: "3,800" },
];

const quickLinks = [
  { label: "Mining", icon: Zap, to: "/mining", gradient: "gradient-accent" },
  { label: "Wallet", icon: Wallet, to: "/wallet", gradient: "gradient-primary" },
  { label: "Invest", icon: TrendingUp, to: "/invest", gradient: "gradient-primary" },
  { label: "Learn", icon: BookOpen, to: "/education", gradient: "gradient-accent" },
];

const moreLinks = [
  { label: "Community", icon: Users, to: "/community", gradient: "gradient-primary" },
  { label: "Ads", icon: Megaphone, to: "/ads", gradient: "gradient-accent" },
  { label: "Verify", icon: Shield, to: "/verification", gradient: "gradient-primary" },
  { label: "Analytics", icon: BarChart3, to: "/market", gradient: "gradient-accent" },
];

const DashboardPage = () => {
  const { balance, monthlyHarvests, harvestAction } = useNdc();

  const harvestClick = () => {
    if (monthlyHarvests >= 4) {
      alert("Monthly harvest limit reached (4/month).");
      return;
    }
    harvestAction();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-premium">
                JF
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Good morning</p>
                <p className="font-display font-bold text-foreground text-[15px]">John Farmer</p>
              </div>
            </div>
            <Link to="/notifications" className="relative w-11 h-11 rounded-2xl bg-card border border-border/60 flex items-center justify-center shadow-premium transition-transform active:scale-95">
              <Bell className="h-[18px] w-[18px] text-muted-foreground" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full ring-2 ring-card" />
            </Link>
          </div>

          {/* Balance Card */}
          <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated overflow-hidden relative rounded-3xl">
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-accent/8 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent/5 blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">Total Digital Harvest</p>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-[32px] font-display font-extrabold tracking-tight leading-none text-metric">{balance.toLocaleString()}</p>
                <span className="text-xs font-medium text-primary-foreground/50 mb-1">NDC</span>
                <span className="flex items-center gap-0.5 text-[11px] font-semibold text-accent mb-1 ml-auto">
                  <ArrowUpRight className="h-3 w-3" /> +12.4%
                </span>
              </div>
              <p className="text-[11px] text-primary-foreground/40 mt-1.5 text-metric">
                ≈ ₦{(balance * 11500).toLocaleString()} · £{(balance * 5).toLocaleString()} · ${(balance * 7).toLocaleString()}
              </p>
              <div className="flex gap-3 mt-5">
                <Link to="/invest" className="flex-1">
                  <Button size="sm" className="w-full gradient-accent text-accent-foreground hover:opacity-90 font-bold text-xs h-10 rounded-2xl shadow-sm transition-all active:scale-[0.97]">
                    🌱 Sow
                  </Button>
                </Link>
                <Button size="sm" variant="outline" onClick={harvestClick} className="flex-1 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-bold text-xs h-10 rounded-2xl transition-all active:scale-[0.97]">
                  🌾 Harvest ({monthlyHarvests}/4)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Yield Trend */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-foreground text-[15px]">Yield Trend</h2>
              <span className="text-[11px] text-muted-foreground font-medium">This Week</span>
            </div>
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-5 pb-3">
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={yieldData}>
                    <defs>
                      <linearGradient id="ndcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(152, 40%, 24%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(152, 40%, 24%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(150, 5%, 42%)' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: 14, fontSize: 12, border: "1px solid hsl(40, 12%, 88%)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", fontFamily: "'DM Sans'" }}
                      formatter={(v: number) => [`${v} NDC`, "Yield"]} />
                    <Area type="monotone" dataKey="ndc" stroke="hsl(152, 40%, 24%)" strokeWidth={2.5} fill="url(#ndcGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-4 gap-3">
            {quickLinks.map((q) => (
              <Link key={q.label} to={q.to} className="flex flex-col items-center gap-2 group">
                <div className={`w-13 h-13 rounded-2xl ${q.gradient} flex items-center justify-center shadow-premium transition-transform group-active:scale-95`} style={{ width: 52, height: 52 }}>
                  <q.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">{q.label}</span>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {moreLinks.map((q) => (
              <Link key={q.label} to={q.to} className="flex flex-col items-center gap-2 group">
                <div className={`w-13 h-13 rounded-2xl ${q.gradient} flex items-center justify-center shadow-premium transition-transform group-active:scale-95`} style={{ width: 52, height: 52 }}>
                  <q.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">{q.label}</span>
              </Link>
            ))}
          </div>

          {/* Active Fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-foreground text-[15px]">Active Fields</h2>
              <Link to="/fields" className="text-[11px] text-primary font-semibold">View All</Link>
            </div>
            <div className="space-y-3">
              {activeFields.map((f) => (
                <Card key={f.name} className="border border-border/60 shadow-premium rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="font-display font-bold text-foreground text-[13px]">{f.name}</h3>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${f.status === "Harvest Ready" ? "bg-accent/15 text-accent-foreground" : "bg-primary/8 text-primary"}`}>
                        {f.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
                      <span>APR: <strong className="text-foreground">{f.apr}</strong></span>
                      <span className="text-metric">{f.ndc} NDC</span>
                    </div>
                    <div className="w-full h-[6px] bg-muted rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${f.maturity}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{f.maturity}% maturity</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
