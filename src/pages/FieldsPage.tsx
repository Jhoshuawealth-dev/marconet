import { Sprout, TrendingUp, Inbox, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { useNdc, NDC_RATES } from "@/contexts/NdcContext";
import PageTransition from "@/components/app/PageTransition";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const FieldsPage = () => {
  const { stakeRecords, claimStake } = useNdc();
  const { toast } = useToast();
  const [claiming, setClaiming] = useState<string | null>(null);

  const active = stakeRecords.filter((s) => s.status === "active");
  const totalStaked = active.reduce((sum, s) => sum + s.amount, 0);

  const handleClaim = async (id: string) => {
    setClaiming(id);
    const res = await claimStake(id);
    if (res.ok) {
      toast({ title: "Harvested 🌾", description: `+${res.payout} NDC credited to your wallet.` });
    } else {
      toast({ title: "Cannot harvest", description: res.error, variant: "destructive" });
    }
    setClaiming(null);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-extrabold text-foreground">My Fields</h1>
            <span className="text-[11px] text-muted-foreground font-medium">{active.length} active</span>
          </div>

          <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated rounded-3xl">
            <CardContent className="p-5">
              <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">Total Staked</p>
              <p className="text-2xl font-display font-extrabold mt-1 text-metric">
                {totalStaked.toLocaleString()} NDC
              </p>
              <p className="text-[11px] text-primary-foreground/40 mt-0.5 text-metric">
                ≈ ₦{(totalStaked * NDC_RATES.NGN).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {stakeRecords.length === 0 ? (
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-8 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-[13px] font-semibold text-foreground">No active fields</p>
                <p className="text-[10px] text-muted-foreground mt-1">Invest in projects to see your staked fields here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {stakeRecords.map((s) => {
                const isMatured = s.status === "active" && s.matured_at && new Date(s.matured_at) <= new Date();
                const payout = s.amount + Math.round(s.amount * s.roi_percent / 100);
                const daysLeft = s.matured_at ? Math.ceil((new Date(s.matured_at).getTime() - Date.now()) / 86400000) : 0;
                return (
                  <Card key={s.id} className="border border-border/60 shadow-premium rounded-2xl">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                            <Sprout className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-display font-bold text-[13px] text-foreground">{s.project_name || `Project #${s.project_id}`}</h3>
                        </div>
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                          s.status === "claimed" ? "bg-muted text-muted-foreground" :
                          isMatured ? "bg-accent/15 text-accent-foreground" : "bg-primary/8 text-primary"
                        }`}>
                          {s.status === "claimed" ? "Harvested" : isMatured ? "Ready" : "Growing"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="h-3 w-3" /> Staked
                        </div>
                        <div className="text-metric font-bold text-foreground text-right">{s.amount.toLocaleString()} NDC</div>
                        <div className="flex items-center gap-1 text-muted-foreground">ROI</div>
                        <div className="text-metric font-bold text-accent-foreground text-right">{s.roi_percent}%</div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" /> {s.status === "claimed" ? "Status" : isMatured ? "Status" : "Matures in"}
                        </div>
                        <div className="text-metric font-semibold text-foreground text-right">
                          {s.status === "claimed" ? "Claimed" : isMatured ? "Ready now" : `${daysLeft}d`}
                        </div>
                      </div>
                      {s.status === "active" && (
                        <Button
                          onClick={() => handleClaim(s.id)}
                          disabled={!isMatured || claiming === s.id}
                          className="w-full h-9 rounded-xl text-[12px] font-bold gap-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {claiming === s.id ? "Harvesting..." : isMatured ? `Harvest ${payout.toLocaleString()} NDC` : "Not ready yet"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default FieldsPage;
