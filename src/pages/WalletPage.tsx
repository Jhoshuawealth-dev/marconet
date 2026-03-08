import { ArrowUpRight, Send, Plus, Wallet, Gift, TrendingUp, ArrowDown, Inbox } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useNdc, NDC_RATES } from "@/contexts/NdcContext";
import { Link } from "react-router-dom";
import PageTransition from "@/components/app/PageTransition";

const WalletPage = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const { balance, transactions } = useNdc();

  // Build yield chart from real transactions
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

  const allTransactions = transactions.map(t => ({
    id: t.id, title: t.title, desc: t.desc, amount: t.amount,
    positive: t.type === "earn", icon: t.type === "earn" ? Gift : Send,
  }));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          <h1 className="text-xl font-display font-extrabold text-foreground">NDC Wallet</h1>

          {/* Balance Card */}
          <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated overflow-hidden relative rounded-3xl">
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-accent/8 blur-3xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4 text-primary-foreground/60" />
                <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">Total Balance</p>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-[32px] font-display font-extrabold tracking-tight leading-none text-metric">{balance.toLocaleString()}</p>
                <span className="text-xs font-medium text-primary-foreground/50 mb-1">NDC</span>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                <p className="text-[11px] text-primary-foreground/40 text-metric">≈ £{(balance * NDC_RATES.GBP).toLocaleString()}</p>
                <p className="text-[11px] text-primary-foreground/40 text-metric">≈ ${(balance * NDC_RATES.USD).toLocaleString()}</p>
                <p className="text-[11px] text-primary-foreground/40 text-metric">≈ ₦{(balance * NDC_RATES.NGN).toLocaleString()}</p>
              </div>

              <div className="flex gap-3 mt-5">
                <Link to="/wallet/fund" className="flex-1">
                  <Button size="sm" className="w-full gradient-accent text-accent-foreground hover:opacity-90 font-bold text-xs h-10 rounded-2xl gap-1 shadow-sm transition-all active:scale-[0.97]">
                    <Plus className="h-3.5 w-3.5" /> Fund
                  </Button>
                </Link>
                <Link to="/wallet/transfer" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-bold text-xs h-10 rounded-2xl gap-1 transition-all active:scale-[0.97]">
                    <Send className="h-3.5 w-3.5" /> Transfer
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Rates */}
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-3.5">
              <p className="text-[10px] font-bold text-foreground mb-1 uppercase tracking-wider">Exchange Rates</p>
              <div className="flex gap-4 text-[11px] text-muted-foreground text-metric">
                <span>1 NDC = £{NDC_RATES.GBP}</span>
                <span>1 NDC = ${NDC_RATES.USD}</span>
                <span>1 NDC = ₦{NDC_RATES.NGN.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Yield Flow Chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-foreground text-[15px]">Yield Flow</h2>
              <div className="flex bg-muted rounded-xl p-0.5">
                {(["week", "month"] as const).map((p) => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                    {p === "week" ? "Week" : "Month"}
                  </button>
                ))}
              </div>
            </div>
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-5 pb-3">
                {yieldData.some(d => d.ndc > 0) ? (
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={yieldData}>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(150, 5%, 42%)' }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: 14, fontSize: 12, border: "1px solid hsl(40, 12%, 88%)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", fontFamily: "'DM Sans'" }}
                        formatter={(v: number) => [`${v} NDC`, "Yield"]} />
                      <Bar dataKey="ndc" fill="hsl(152, 40%, 24%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[140px] flex items-center justify-center text-center">
                    <div>
                      <TrendingUp className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-[12px] text-muted-foreground">No yield data yet</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">Earn NDC to see your yield flow</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div>
            <h2 className="font-display font-bold text-foreground text-[15px] mb-3">Transaction History</h2>
            {allTransactions.length === 0 ? (
              <Card className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-8 text-center">
                  <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-[13px] font-semibold text-foreground">No transactions yet</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Fund your wallet or start mining to see activity here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {allTransactions.slice(0, 10).map((t) => (
                  <Card key={t.id} className="border border-border/60 shadow-premium rounded-2xl">
                    <CardContent className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.positive ? "bg-primary/8" : "bg-destructive/8"}`}>
                          <t.icon className={`h-4 w-4 ${t.positive ? "text-primary" : "text-destructive"}`} />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-foreground">{t.title}</p>
                          <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                        </div>
                      </div>
                      <span className={`text-[12px] font-bold text-metric ${t.positive ? "text-primary" : "text-destructive"}`}>
                        {t.positive ? "+" : "-"}{t.amount} NDC
                      </span>
                    </CardContent>
                  </Card>
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

export default WalletPage;
