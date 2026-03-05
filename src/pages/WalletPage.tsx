import { useState } from "react";
import { ArrowUpRight, Send, Plus, Wallet, Gift, TrendingUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useNdc, NDC_RATES } from "@/contexts/NdcContext";
import { Link } from "react-router-dom";

const yieldData = [
  { day: "Mon", ndc: 80 }, { day: "Tue", ndc: 120 }, { day: "Wed", ndc: 95 },
  { day: "Thu", ndc: 180 }, { day: "Fri", ndc: 150 }, { day: "Sat", ndc: 200 }, { day: "Sun", ndc: 170 },
];

const defaultTransactions = [
  { id: "d1", title: "Harvest Reward", desc: "Green Valley Soy", amount: 320, icon: Gift, positive: true },
  { id: "d2", title: "Staking Deposit", desc: "Maize Field Project", amount: 500, icon: ArrowDown, positive: false },
  { id: "d3", title: "Referral Bonus", desc: "User @farmjoy", amount: 150, icon: Gift, positive: true },
];

const WalletPage = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const { balance, transactions } = useNdc();

  const allTransactions = [
    ...transactions.map(t => ({
      id: t.id, title: t.title, desc: t.desc, amount: t.amount,
      positive: t.type === "earn", icon: t.type === "earn" ? Gift : Send,
    })),
    ...defaultTransactions,
  ];

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
              <p className="text-3xl font-extrabold tracking-tight">{balance.toLocaleString()} NDC</p>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-accent mb-1">
                <ArrowUpRight className="h-3 w-3" /> +5.8%
              </span>
            </div>

            {/* Multi-currency equivalents */}
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
              <p className="text-xs text-primary-foreground/50">≈ £{(balance * NDC_RATES.GBP).toLocaleString()}</p>
              <p className="text-xs text-primary-foreground/50">≈ ${(balance * NDC_RATES.USD).toLocaleString()}</p>
              <p className="text-xs text-primary-foreground/50">≈ ₦{(balance * NDC_RATES.NGN).toLocaleString()}</p>
            </div>

            <div className="flex gap-3 mt-4">
              <Link to="/wallet/fund" className="flex-1">
                <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs h-9 rounded-xl gap-1">
                  <Plus className="h-3.5 w-3.5" /> Fund
                </Button>
              </Link>
              <Link to="/wallet/transfer" className="flex-1">
                <Button size="sm" variant="outline" className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold text-xs h-9 rounded-xl gap-1">
                  <Send className="h-3.5 w-3.5" /> Transfer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Rates */}
        <Card className="border shadow-sm">
          <CardContent className="p-3">
            <p className="text-[10px] font-bold text-foreground mb-1">Exchange Rates</p>
            <div className="flex gap-4 text-[10px] text-muted-foreground">
              <span>1 NDC = £{NDC_RATES.GBP}</span>
              <span>1 NDC = ${NDC_RATES.USD}</span>
              <span>1 NDC = ₦{NDC_RATES.NGN.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Yield Flow Chart */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground text-sm">Yield Flow</h2>
            <div className="flex bg-muted rounded-lg p-0.5">
              {(["week", "month"] as const).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`text-[10px] font-semibold px-3 py-1 rounded-md transition-colors ${period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
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
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(v: number) => [`${v} NDC`, "Yield"]} />
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
          </div>
          <div className="space-y-2">
            {allTransactions.slice(0, 10).map((t) => (
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
                    {t.positive ? "+" : "-"}{t.amount} NDC
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
