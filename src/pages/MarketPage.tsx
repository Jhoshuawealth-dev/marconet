import { Search, Filter, TrendingUp, TrendingDown, ArrowUpRight, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/app/BottomNav";
import PageTransition from "@/components/app/PageTransition";

// Empty — will be populated from real market data via backend
const marketItems: any[] = [];

const MarketPage = () => (
  <PageTransition>
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
        <h1 className="text-xl font-display font-extrabold text-foreground">Market</h1>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tokens..." className="pl-9 h-11 rounded-2xl bg-muted/50 border-border/60 text-[13px]" />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl border-border/60">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Market overview */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-3.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Market Cap</p>
              <p className="text-lg font-display font-extrabold text-foreground text-metric mt-0.5">—</p>
            </CardContent>
          </Card>
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-3.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">24h Volume</p>
              <p className="text-lg font-display font-extrabold text-foreground text-metric mt-0.5">—</p>
            </CardContent>
          </Card>
        </div>

        {/* Token List */}
        {marketItems.length === 0 ? (
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-8 text-center">
              <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-[13px] font-semibold text-foreground">No market data yet</p>
              <p className="text-[10px] text-muted-foreground mt-1">Market listings will appear here once the platform is live.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {marketItems.map((m: any) => (
              <Card key={m.name} className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.trending ? "bg-primary/8" : "bg-destructive/8"}`}>
                      {m.trending ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground">Vol: {m.volume}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-bold text-foreground text-metric">{m.price}</p>
                    <p className={`text-[10px] font-semibold ${m.trending ? "text-primary" : "text-destructive"}`}>{m.change}</p>
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

export default MarketPage;
