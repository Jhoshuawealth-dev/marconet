import { useState, useEffect } from "react";
import { Zap, Cpu, TrendingUp, Wifi, WifiOff, Clock, Gift, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { useNdc } from "@/contexts/NdcContext";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/app/PageTransition";

const miningHistory = [
  { id: 1, date: "Today, 2:30 PM", ndc: "+45 NDC", type: "AI Harvest", status: "Completed" },
  { id: 2, date: "Today, 10:15 AM", ndc: "+32 NDC", type: "Data Mining", status: "Completed" },
  { id: 3, date: "Yesterday", ndc: "+78 NDC", type: "Boost Mining", status: "Completed" },
  { id: 4, date: "Mar 1", ndc: "+120 NDC", type: "AI Harvest", status: "Completed" },
];

const upgrades = [
  { name: "Hash Boost Pro", desc: "2x mining speed for 24h", cost: "500 NDC", icon: Zap },
  { name: "Network Shield", desc: "Priority mining lanes", cost: "800 NDC", icon: ShieldCheck },
  { name: "Auto-Harvest", desc: "Automatic yield collection", cost: "1,200 NDC", icon: Cpu },
];

const MiningPage = () => {
  const { isMining, miningSession, startMining, stopMining, balance } = useNdc();
  const { toast } = useToast();

  const handleUpgrade = (name: string) => {
    toast({ title: "Coming Soon", description: `${name} will be available in the next update.` });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-extrabold text-foreground">AI Farming</h1>
            <span className={`text-[11px] font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isMining ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {isMining ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isMining ? "Active" : "Idle"}
            </span>
          </div>

          {/* Mining Status Card */}
          <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated overflow-hidden relative rounded-3xl">
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-accent/8 blur-3xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">Current Session</p>
                  <p className="text-[32px] font-display font-extrabold tracking-tight leading-none text-metric mt-1">{miningSession} NDC</p>
                  <p className="text-[11px] text-primary-foreground/40 mt-1 text-metric">Balance: {balance.toLocaleString()} NDC</p>
                </div>
                <div className={`w-20 h-20 rounded-full border-[3px] ${isMining ? "border-accent animate-pulse-subtle" : "border-primary-foreground/15"} flex items-center justify-center`}>
                  <Cpu className={`h-8 w-8 ${isMining ? "text-accent" : "text-primary-foreground/30"}`} />
                </div>
              </div>

              <Button
                onClick={() => isMining ? stopMining() : startMining()}
                size="sm"
                className={`w-full font-bold text-[13px] h-11 rounded-2xl transition-all active:scale-[0.97] ${isMining ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "gradient-accent text-accent-foreground"}`}
              >
                {isMining ? "⏸ Stop Mining" : "▶ Start Mining"}
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 text-center">
                <Zap className="h-5 w-5 text-accent mx-auto mb-1.5" />
                <p className="text-lg font-display font-extrabold text-foreground text-metric">{isMining ? "42.5" : "0.0"}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Hash Power (MH/s)</p>
              </CardContent>
            </Card>
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-lg font-display font-extrabold text-foreground text-metric">{miningSession}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Session Yield (NDC)</p>
              </CardContent>
            </Card>
          </div>

          {/* Network Health */}
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4">
              <h3 className="font-display font-bold text-[13px] text-foreground mb-3">Network Health</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Uptime", value: isMining ? "99.8%" : "—" },
                  { label: "Latency", value: isMining ? "12ms" : "—" },
                  { label: "Peers", value: isMining ? "847" : "0" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-foreground text-metric">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mining Upgrades */}
          <div>
            <h2 className="font-display font-bold text-foreground text-[15px] mb-3">Mining Upgrades</h2>
            <div className="space-y-3">
              {upgrades.map((u) => (
                <Card key={u.name} className="border border-border/60 shadow-premium rounded-2xl">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-accent/12 flex items-center justify-center">
                      <u.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[13px] text-foreground">{u.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{u.desc}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-[10px] h-8 rounded-xl font-bold border-border/60"
                      onClick={() => handleUpgrade(u.name)}>
                      {u.cost}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mining History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-foreground text-[15px]">Mining History</h2>
              <button className="text-[11px] text-primary font-semibold">View All</button>
            </div>
            <div className="space-y-2">
              {miningHistory.map((h) => (
                <Card key={h.id} className="border border-border/60 shadow-premium rounded-2xl">
                  <CardContent className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                        <Gift className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-foreground">{h.type}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" /> {h.date}
                        </p>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-primary text-metric">{h.ndc}</span>
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

export default MiningPage;
