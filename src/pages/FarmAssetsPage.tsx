import { ArrowLeft, Sprout, MapPin, Droplets, Sun, ThermometerSun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import PageTransition from "@/components/app/PageTransition";

const farms = [
  { id: 1, name: "Green Valley Soy", location: "Ogun State", size: "12 Hectares", crop: "Soybeans", status: "Growing", health: 85, moisture: "72%", temp: "28°C" },
  { id: 2, name: "Sunrise Maize Field", location: "Kaduna State", size: "8 Hectares", crop: "Maize", status: "Active", health: 92, moisture: "68%", temp: "31°C" },
  { id: 3, name: "Cassava Digital Farm", location: "Ondo State", size: "5 Hectares", crop: "Cassava", status: "Harvest Ready", health: 98, moisture: "55%", temp: "29°C" },
];

const FarmAssetsPage = () => (
  <PageTransition>
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
        <div className="flex items-center gap-3">
          <Link to="/profile"><ArrowLeft className="h-5 w-5 text-foreground" /></Link>
          <h1 className="text-xl font-extrabold text-foreground">Farm Assets</h1>
        </div>

        <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
          <CardContent className="p-4">
            <p className="text-xs text-primary-foreground/70 font-medium">Total Farm Holdings</p>
            <p className="text-2xl font-extrabold mt-1">25 Hectares</p>
            <p className="text-xs text-primary-foreground/60 mt-1">3 registered farms · Avg health 91%</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {farms.map(f => (
            <Card key={f.id} className="border shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sprout className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{f.name}</h3>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> {f.location}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${f.status === "Harvest Ready" ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"}`}>
                    {f.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Droplets className="h-3 w-3" /> {f.moisture}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ThermometerSun className="h-3 w-3" /> {f.temp}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Sun className="h-3 w-3" /> {f.crop}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Crop Health</span>
                    <span>{f.health}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${f.health}%` }} />
                  </div>
                </div>

                <div className="flex gap-2 text-[10px]">
                  <span className="text-muted-foreground">Size: <strong className="text-foreground">{f.size}</strong></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button className="w-full font-bold rounded-xl h-12 gap-2">
          <Sprout className="h-4 w-4" /> Register New Farm
        </Button>
      </div>
      <BottomNav />
    </div>
  </PageTransition>
);

export default FarmAssetsPage;
