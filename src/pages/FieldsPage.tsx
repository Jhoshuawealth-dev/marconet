import { Sprout, TrendingUp, Clock, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import BottomNav from "@/components/app/BottomNav";
import { useNdc, NDC_RATES } from "@/contexts/NdcContext";
import PageTransition from "@/components/app/PageTransition";

const FieldsPage = () => {
  const { stakedProjects, balance } = useNdc();

  const stakedEntries = Object.entries(stakedProjects).filter(([, amount]) => amount > 0);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-extrabold text-foreground">My Fields</h1>
            <span className="text-[11px] text-muted-foreground font-medium">{stakedEntries.length} active</span>
          </div>

          <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated rounded-3xl">
            <CardContent className="p-5">
              <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">Total Staked</p>
              <p className="text-2xl font-display font-extrabold mt-1 text-metric">
                {stakedEntries.reduce((sum, [, amt]) => sum + amt, 0).toLocaleString()} NDC
              </p>
              <p className="text-[11px] text-primary-foreground/40 mt-0.5 text-metric">
                ≈ ₦{(stakedEntries.reduce((sum, [, amt]) => sum + amt, 0) * NDC_RATES.NGN).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {stakedEntries.length === 0 ? (
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-8 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-[13px] font-semibold text-foreground">No active fields</p>
                <p className="text-[10px] text-muted-foreground mt-1">Invest in projects to see your staked fields here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {stakedEntries.map(([projectId, amount]) => (
                <Card key={projectId} className="border border-border/60 shadow-premium rounded-2xl">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                          <Sprout className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="font-display font-bold text-[13px] text-foreground">Project #{projectId}</h3>
                      </div>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/8 text-primary">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Staked</span>
                      <span className="text-metric font-bold text-foreground">{amount.toLocaleString()} NDC</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default FieldsPage;
