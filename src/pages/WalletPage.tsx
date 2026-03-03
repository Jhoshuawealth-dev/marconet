import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Send, Plus, Wallet, Gift, TrendingUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const yieldData = [
  { day: "Mon", ndc: 80 }, { day: "Tue", ndc: 120 }, { day: "Wed", ndc: 95 },
  { day: "Thu", ndc: 180 }, { day: "Fri", ndc: 150 }, { day: "Sat", ndc: 200 }, { day: "Sun", ndc: 170 },
];

const transactions = [
  { id: 1, title: "Harvest Reward", desc: "Green Valley Soy", amount: "+320 NDC", icon: Gift, positive: true },
  { id: 2, title: "Staking Deposit", desc: "Maize Field Project", amount: "-500 NDC", icon: ArrowDown, positive: false },
  { id: 3, title: "Withdrawal", desc: "To Bank Account", amount: "-1,200 NDC", icon: Send, positive: false },
  { id: 4, title: "Referral Bonus", desc: "User @farmjoy", amount: "+150 NDC", icon: Gift, positive: true },
  { id: 5, title: "Mining Reward", desc: "AI Farming Session", amount: "+85 NDC", icon: TrendingUp, positive: true },
];

const WalletPage = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        <h1 className="text-xl font-extrabold text-foreground">NDC Wallet</h1>

        {/* Balance Card */}
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg overflow-hidden relative">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
          <CardContent className="p-5 relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-primary-foreground/70" />
              <p className="text-xs text-primary-foreground/70 font-medium">Total Balance</p>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-extrabold tracking-tight">12,450 NDC</p>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-accent mb-1">
                <ArrowUpRight className="h-3 w-3" /> +5.8%
              </span>
            </div>
            <p className="text-xs text-primary-foreground/50 mt-1">≈ ₦249,000</p>

            <div className="flex gap-3 mt-4">
              <Button size="sm" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs h-9 rounded-xl gap-1">
                <Plus className="h-3.5 w-3.5" /> Fund
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold text-xs h-9 rounded-xl gap-1">
                <Send className="h-3.5 w-3.5" /> Transfer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Yield Flow Chart */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground text-sm">Yield Flow</h2>
            <div className="flex bg-muted rounded-lg p-0.5">
              {(["week", "month"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`text-[10px] font-semibold px-3 py-1 rounded-md transition-colors ${period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  {p === "week" ? "Week" : "Month"}
                </button>
              ))}
            </div>
          </div>
          <Card className="border shadow-sm">
            <CardContent className="p-4 pb-2">
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={yieldData}>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, fontSize: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(v: number) => [`${v} NDC`, "Yield"]}
                  />
                  <Bar dataKey="ndc" fill="hsl(150, 37%, 27%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground text-sm">Transaction History</h2>
            <button className="text-xs text-primary font-semibold">View All</button>
          </div>
          <div className="space-y-2">
            {transactions.map((t) => (
              <Card key={t.id} className="border shadow-sm">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.positive ? "bg-primary/10" : "bg-destructive/10"}`}>
                      <t.icon className={`h-4 w-4 ${t.positive ? "text-primary" : "text-destructive"}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{t.title}</p>
                      <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${t.positive ? "text-primary" : "text-destructive"}`}>
                    {t.amount}
                  </span>
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

export default WalletPage;
