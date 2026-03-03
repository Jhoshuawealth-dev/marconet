import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Clock, Boxes } from "lucide-react";

const projects = [
  { name: "Green Valley Soy", roi: "18.5%", price: "₦2,500", units: 120, timeline: "6 months", status: "Active" },
  { name: "Sunrise Maize Field", roi: "22.0%", price: "₦1,800", units: 200, timeline: "4 months", status: "Active" },
  { name: "Cassava Digital Farm", roi: "15.2%", price: "₦3,000", units: 80, timeline: "8 months", status: "Filling" },
  { name: "Rice Paddy Project", roi: "20.0%", price: "₦2,200", units: 150, timeline: "5 months", status: "Active" },
];

const FeaturedProjects = () => (
  <section id="projects" className="py-20 bg-background">
    <div className="container max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Featured Projects</h2>
        <p className="mt-3 text-muted-foreground">Invest in verified digital farmland opportunities.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {projects.map((p) => (
          <Card key={p.name} className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Color strip */}
            <div className="h-2 bg-primary" />
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground text-sm">{p.name}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-accent" />
                  <span>ROI: <strong className="text-foreground">{p.roi}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-accent" />
                  <span>{p.timeline}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Boxes className="h-3.5 w-3.5 text-accent" />
                  <span>{p.units} units</span>
                </div>
                <div className="text-muted-foreground">
                  <span>{p.price}<span className="text-[10px]">/unit</span></span>
                </div>
              </div>

              <Link to="/signup" className="w-full">
                <Button size="sm" className="w-full text-xs font-bold">Invest Now</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProjects;
