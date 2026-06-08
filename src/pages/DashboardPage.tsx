import { Bell, TrendingUp, ArrowUpRight, Zap, Leaf, Wallet, Users, BookOpen, Megaphone, Shield, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { useNdc, NDC_RATES } from "@/contexts/NdcContext";
import { useAuth } from "@/contexts/AuthContext";
import PageTransition from "@/components/app/PageTransition";
import AdSlot from "@/components/app/AdSlot";

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
  const { balance, monthlyHarvests, harvestAction, transactions } = useNdc();
  const { user } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Farmer";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Build yield data from recent transactions (last 7 days)
  const yieldData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayLabel = days[d.getDay()];
      const dayEarnings = transactions
        .filter(t => t.type === "earn" && new Date(t.date).toDateString() === d.toDateString())
        .reduce((sum, t) => sum + t.amount, 0);
      data.push({ day: dayLabel, ndc: dayEarnings });
    }
    return data;
  })();

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
                {initials}
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Welcome back</p>
                <p className="font-display font-bold text-foreground text-[15px]">{displayName}</p>
              </div>
            </div>
            <Link to="/notifications" className="relative w-11 h-11 rounded-2xl bg-card border border-border/60 flex items-center justify-center shadow-premium transition-transform active:scale-95">
              <Bell className="h-[18px] w-[18px] text-muted-foreground" />
              {transactions.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full ring-2 ring-card" />
              )}
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
              </div>
              <p className="text-[11px] text-primary-foreground/40 mt-1.5 text-metric">
                ≈ ₦{(balance * NDC_RATES.NGN).toLocaleString()} · £{(balance * NDC_RATES.GBP).toLocaleString()} · ${(balance * NDC_RATES.USD).toLocaleString()}
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
              <span className="text-[11px] text-muted-foreground font-medium">Last 7 Days</span>
            </div>
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-5 pb-3">
                {yieldData.some(d => d.ndc > 0) ? (
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
                ) : (
                  <div className="h-[140px] flex items-center justify-center text-center">
                    <div>
                      <Leaf className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-[12px] text-muted-foreground">No yield activity yet</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">Start mining or investing to see trends</p>
                    </div>
                  </div>
                )}
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

          <AdSlot />


          {/* Recent Activity */}
          {transactions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-foreground text-[15px]">Recent Activity</h2>
                <Link to="/notifications" className="text-[11px] text-primary font-semibold">View All</Link>
              </div>
              <div className="space-y-2">
                {transactions.slice(0, 3).map((t) => (
                  <Card key={t.id} className="border border-border/60 shadow-premium rounded-2xl">
                    <CardContent className="p-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-foreground">{t.title}</p>
                        <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                      </div>
                      <span className={`text-[12px] font-bold text-metric ${t.type === "earn" ? "text-primary" : "text-destructive"}`}>
                        {t.type === "earn" ? "+" : "-"}{t.amount} NDC
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
