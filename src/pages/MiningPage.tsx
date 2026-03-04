import { useState, useEffect } from "react";
import { Zap, Cpu, TrendingUp, Wifi, WifiOff, ArrowUpRight, Clock, Gift, ShieldCheck, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { useNdc } from "@/contexts/NdcContext";
import { useToast } from "@/hooks/use-toast";

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
    toast({
      title: "Coming Soon! 🚧",
      description: `${name} upgrade will be available in the next update.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-foreground">AI Farming</h1>
          <span className="text-xs font-semibold text-primary flex items-center gap-1">
            {isMining ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isMining ? "Active" : "Idle"}
          </span>
        </div>

        {/* Mining Status Card */}
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg overflow-hidden relative">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
          <CardContent className="p-5 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-primary-foreground/70 font-medium">Current Session</p>
                <p className="text-3xl font-extrabold tracking-tight">{miningSession} NDC</p>
                <p className="text-xs text-primary-foreground/50 mt-1">Balance: {balance.toLocaleString()} NDC</p>
              </div>
              <div className={`w-20 h-20 rounded-full border-4 ${isMining ? "border-accent animate-pulse" : "border-primary-foreground/20"} flex items-center justify-center`}>
                <Cpu className={`h-8 w-8 ${isMining ? "text-accent" : "text-primary-foreground/40"}`} />
              </div>
            </div>

            <Button
              onClick={() => isMining ? stopMining() : startMining()}
              size="sm"
              className={`w-full font-bold text-xs h-10 rounded-xl ${isMining ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-accent text-accent-foreground hover:bg-accent/90"}`}
            >
              {isMining ? "⏸ Stop Mining" : "▶ Start Mining"}
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border shadow-sm">
            <CardContent className="p-4 text-center">
              <Zap className="h-5 w-5 text-accent mx-auto mb-1" />
              <p className="text-lg font-extrabold text-foreground">{isMining ? "42.5" : "0.0"}</p>
              <p className="text-[10px] text-muted-foreground">Hash Power (MH/s)</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-extrabold text-foreground">{miningSession}</p>
              <p className="text-[10px] text-muted-foreground">Session Yield (NDC)</p>
            </CardContent>
          </Card>
        </div>

        {/* Network Health */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-sm text-foreground mb-3">Network Health</h3>
            <div className="space-y-2">
              {[
                { label: "Uptime", value: isMining ? "99.8%" : "—" },
                { label: "Latency", value: isMining ? "12ms" : "—" },
                { label: "Peers", value: isMining ? "847" : "0" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mining Upgrades */}
        <div>
          <h2 className="font-bold text-foreground text-sm mb-3">Mining Upgrades</h2>
          <div className="space-y-3">
            {upgrades.map((u) => (
              <Card key={u.name} className="border shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                    <u.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-foreground">{u.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{u.desc}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-[10px] h-8 rounded-xl font-bold"
                    onClick={() => handleUpgrade(u.name)}
                  >
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
            <h2 className="font-bold text-foreground text-sm">Mining History</h2>
            <button className="text-xs text-primary font-semibold">View All</button>
          </div>
          <div className="space-y-2">
            {miningHistory.map((h) => (
              <Card key={h.id} className="border shadow-sm">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Gift className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{h.type}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {h.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">{h.ndc}</span>
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

export default MiningPage;
