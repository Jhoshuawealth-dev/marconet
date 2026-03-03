import { Sprout, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";

const fields = [
  { name: "Green Valley Soy", maturity: 72, apr: "18.5%", status: "Growing", ndc: "2,400", planted: "Jan 15, 2026" },
  { name: "Sunrise Maize Field", maturity: 45, apr: "22.0%", status: "Active", ndc: "1,200", planted: "Feb 1, 2026" },
  { name: "Cassava Digital Farm", maturity: 90, apr: "15.2%", status: "Harvest Ready", ndc: "3,800", planted: "Dec 10, 2025" },
  { name: "Rice Paddy Project", maturity: 60, apr: "20.0%", status: "Growing", ndc: "1,800", planted: "Jan 20, 2026" },
  { name: "Cocoa Bean Estate", maturity: 15, apr: "25.0%", status: "Seedling", ndc: "420", planted: "Feb 20, 2026" },
];

const FieldsPage = () => (
  <div className="min-h-screen bg-background pb-20">
    <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-foreground">My Fields</h1>
        <span className="text-xs text-muted-foreground">{fields.length} active</span>
      </div>

      <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
        <CardContent className="p-4">
          <p className="text-xs text-primary-foreground/70">Total Field Earnings</p>
          <p className="text-2xl font-extrabold mt-1">9,620 NDC</p>
          <p className="text-xs text-primary-foreground/50 mt-0.5">≈ ₦192,400</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {fields.map((f) => (
          <Card key={f.name} className="border shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">{f.name}</h3>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  f.status === "Harvest Ready" ? "bg-accent/20 text-accent-foreground" :
                  f.status === "Seedling" ? "bg-secondary/30 text-secondary-foreground" :
                  "bg-primary/10 text-primary"
                }`}>
                  {f.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> APR: <strong className="text-foreground">{f.apr}</strong></span>
                <span>{f.ndc} NDC earned</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Planted: {f.planted}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${f.maturity}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground">{f.maturity}% maturity</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    <BottomNav />
  </div>
);

export default FieldsPage;
