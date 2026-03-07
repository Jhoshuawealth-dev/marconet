import { Sprout, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import BottomNav from "@/components/app/BottomNav";
import PageTransition from "@/components/app/PageTransition";

const fields = [
  { name: "Green Valley Soy", maturity: 72, apr: "18.5%", status: "Growing", ndc: "2,400", planted: "Jan 15, 2026" },
  { name: "Sunrise Maize Field", maturity: 45, apr: "22.0%", status: "Active", ndc: "1,200", planted: "Feb 1, 2026" },
  { name: "Cassava Digital Farm", maturity: 90, apr: "15.2%", status: "Harvest Ready", ndc: "3,800", planted: "Dec 10, 2025" },
  { name: "Rice Paddy Project", maturity: 60, apr: "20.0%", status: "Growing", ndc: "1,800", planted: "Jan 20, 2026" },
  { name: "Cocoa Bean Estate", maturity: 15, apr: "25.0%", status: "Seedling", ndc: "420", planted: "Feb 20, 2026" },
];

const FieldsPage = () => (
  <PageTransition>
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-extrabold text-foreground">My Fields</h1>
          <span className="text-[11px] text-muted-foreground font-medium">{fields.length} active</span>
        </div>

        <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated rounded-3xl">
          <CardContent className="p-5">
            <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">Total Field Earnings</p>
            <p className="text-2xl font-display font-extrabold mt-1 text-metric">9,620 NDC</p>
            <p className="text-[11px] text-primary-foreground/40 mt-0.5 text-metric">≈ ₦110,630,000</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {fields.map((f) => (
            <Card key={f.name} className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                      <Sprout className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-[13px] text-foreground">{f.name}</h3>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    f.status === "Harvest Ready" ? "bg-accent/15 text-accent-foreground" :
                    f.status === "Seedling" ? "bg-secondary/40 text-secondary-foreground" :
                    "bg-primary/8 text-primary"
                  }`}>
                    {f.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> APR: <strong className="text-foreground text-metric">{f.apr}</strong></span>
                  <span className="text-metric">{f.ndc} NDC</span>
                </div>
                <div className="flex items-center text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" /> Planted: {f.planted}
                </div>
                <div className="w-full h-[6px] bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${f.maturity}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{f.maturity}% maturity</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  </PageTransition>
);

export default FieldsPage;
