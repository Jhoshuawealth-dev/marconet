import { useState } from "react";
import { TrendingUp, Clock, Boxes, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import { useNdc } from "@/contexts/NdcContext";
import PageTransition from "@/components/app/PageTransition";

const projects = [
  { id: "1", name: "Green Valley Soy", roi: "18.5%", roiNum: 18.5, price: "₦2,500", units: 120, timeline: "6 months", status: "Active", raised: 72 },
  { id: "2", name: "Sunrise Maize Field", roi: "22.0%", roiNum: 22, price: "₦1,800", units: 200, timeline: "4 months", status: "Active", raised: 45 },
  { id: "3", name: "Cassava Digital Farm", roi: "15.2%", roiNum: 15.2, price: "₦3,000", units: 80, timeline: "8 months", status: "Filling", raised: 88 },
  { id: "4", name: "Rice Paddy Project", roi: "20.0%", roiNum: 20, price: "₦2,200", units: 150, timeline: "5 months", status: "Active", raised: 60 },
  { id: "5", name: "Cocoa Bean Estate", roi: "25.0%", roiNum: 25, price: "₦4,500", units: 50, timeline: "12 months", status: "New", raised: 15 },
];

const filters = ["All", "Active", "New", "Filling", "High ROI"];

const InvestPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const { balance } = useNdc();

  const filtered = projects.filter(p => {
    if (activeFilter === "All") return true;
    if (activeFilter === "High ROI") return p.roiNum >= 20;
    return p.status === activeFilter;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          <h1 className="text-xl font-display font-extrabold text-foreground">Invest</h1>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search projects..." className="pl-9 h-11 rounded-2xl bg-muted/50 border-border/60 text-[13px]" />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl border-border/60">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`text-[11px] font-semibold px-3.5 py-2 rounded-full whitespace-nowrap transition-all ${activeFilter === f ? "gradient-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"}`}>
                {f}
              </button>
            ))}
          </div>

          {/* Portfolio Summary */}
          <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated rounded-3xl">
            <CardContent className="p-5">
              <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">Your Portfolio</p>
              <p className="text-2xl font-display font-extrabold mt-1 text-metric">{balance.toLocaleString()} NDC <span className="text-xs font-normal text-primary-foreground/50">balance</span></p>
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <p className="text-[13px] text-muted-foreground text-center py-8">No projects match this filter.</p>
            )}
            {filtered.map((p) => (
              <Link key={p.id} to={`/invest/${p.id}`}>
                <Card className="border border-border/60 shadow-premium hover:shadow-elevated transition-all overflow-hidden rounded-2xl mb-3">
                  <div className="h-1 gradient-primary" />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-foreground text-[13px]">{p.name}</h3>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        p.status === "New" ? "bg-accent/15 text-accent-foreground" : p.status === "Filling" ? "bg-destructive/10 text-destructive" : "bg-primary/8 text-primary"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5 text-accent" />
                        ROI: <strong className="text-foreground text-metric">{p.roi}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-accent" />
                        {p.timeline}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Boxes className="h-3.5 w-3.5 text-accent" />
                        {p.units} units
                      </div>
                      <div className="text-muted-foreground text-metric">{p.price}/unit</div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Raised</span><span className="text-metric">{p.raised}%</span>
                      </div>
                      <div className="w-full h-[6px] bg-muted rounded-full overflow-hidden">
                        <div className="h-full gradient-primary rounded-full" style={{ width: `${p.raised}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default InvestPage;
