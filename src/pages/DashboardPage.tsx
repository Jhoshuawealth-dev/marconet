import { Bell, Sprout, TrendingUp, ArrowUpRight, Zap, Leaf, Wallet, Users, BookOpen, Megaphone, Shield, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { useNdc } from "@/contexts/NdcContext";

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
  { label: "Mining", icon: Zap, to: "/mining", color: "bg-accent" },
  { label: "Wallet", icon: Wallet, to: "/wallet", color: "bg-primary" },
  { label: "Invest", icon: TrendingUp, to: "/invest", color: "bg-secondary" },
  { label: "Learn", icon: BookOpen, to: "/education", color: "bg-accent" },
];

const moreLinks = [
  { label: "Community", icon: Users, to: "/community", color: "bg-primary" },
  { label: "Ads", icon: Megaphone, to: "/ads", color: "bg-accent" },
  { label: "Verify", icon: Shield, to: "/verification", color: "bg-secondary" },
  { label: "Analytics", icon: BarChart3, to: "/market", color: "bg-primary" },
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
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">JF</div>
            <div>
              <p className="text-xs text-muted-foreground">Good morning 🌱</p>
              <p className="font-bold text-foreground">John Farmer</p>
            </div>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-card border flex items-center justify-center">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
          </button>
        </div>

        <Card className="bg-primary text-primary-foreground border-0 shadow-lg overflow-hidden relative">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
          <CardContent className="p-5 relative z-10">
            <p className="text-xs text-primary-foreground/70 font-medium">Total Digital Harvest</p>
            <div className="flex items-end gap-3 mt-1">
              <p className="text-3xl font-extrabold tracking-tight">{balance.toLocaleString()} NDC</p>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-accent mb-1">
                <ArrowUpRight className="h-3 w-3" /> +12.4%
              </span>
            </div>
            <p className="text-xs text-primary-foreground/50 mt-1">≈ ₦{(balance * 11500).toLocaleString()} · £{(balance * 5).toLocaleString()} · ${(balance * 7).toLocaleString()}</p>
            <div className="flex gap-3 mt-4">
              <Link to="/invest" className="flex-1">
                <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs h-9 rounded-xl">🌱 Sow</Button>
              </Link>
              <Link to="/wallet" className="flex-1">
                <Button size="sm" variant="outline" onClick={harvestClick} className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold text-xs h-9 rounded-xl">🌾 Harvest ({monthlyHarvests}/4)</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground text-sm">Yield Trend</h2>
            <span className="text-xs text-muted-foreground">This Week</span>
          </div>
          <Card className="border shadow-sm">
            <CardContent className="p-4 pb-2">
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={yieldData}>
                  <defs>
                    <linearGradient id="ndcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(150, 37%, 27%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(150, 37%, 27%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(v: number) => [`${v} NDC`, "Yield"]} />
                  <Area type="monotone" dataKey="ndc" stroke="hsl(150, 37%, 27%)" strokeWidth={2} fill="url(#ndcGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map((q) => (
            <Link key={q.label} to={q.to} className="flex flex-col items-center gap-1.5">
              <div className={`w-12 h-12 rounded-2xl ${q.color} flex items-center justify-center shadow-sm`}>
                <q.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">{q.label}</span>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {moreLinks.map((q) => (
            <Link key={q.label} to={q.to} className="flex flex-col items-center gap-1.5">
              <div className={`w-12 h-12 rounded-2xl ${q.color} flex items-center justify-center shadow-sm`}>
                <q.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">{q.label}</span>
            </Link>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground text-sm">Active Fields</h2>
            <Link to="/fields" className="text-xs text-primary font-semibold">View All</Link>
          </div>
          <div className="space-y-3">
            {activeFields.map((f) => (
              <Card key={f.name} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground text-sm">{f.name}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${f.status === "Harvest Ready" ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"}`}>{f.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>APR: <strong className="text-foreground">{f.apr}</strong></span>
                    <span>{f.ndc} NDC earned</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${f.maturity}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{f.maturity}% maturity</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default DashboardPage;
