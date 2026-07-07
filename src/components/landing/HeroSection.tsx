import { Button } from "@/components/ui/button";
import { Sprout, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroFarm from "@/assets/hero-farm.jpg";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-primary text-primary-foreground">
    {/* Decorative circles */}
    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
    <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-secondary/15 blur-3xl" />

    <div className="container max-w-6xl mx-auto py-16 md:py-24 relative z-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            <Sprout className="h-3.5 w-3.5" /> Digital Farming Revolution
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Farm Your Data.
            <br />
            <span className="text-accent">Earn Real Value.</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg leading-relaxed">
            Stake in sustainable digital farmlands, grow your NDC yield, and harvest real returns — all powered by community and transparency.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 pt-2">
            <div>
              <p className="text-2xl font-extrabold text-accent">12,400+</p>
              <p className="text-xs text-primary-foreground/60 flex items-center gap-1"><Users className="h-3 w-3" /> Active Farmers</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-accent">₦8.2M</p>
              <p className="text-xs text-primary-foreground/60 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> NDC Paid Out</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-accent">24.5%</p>
              <p className="text-xs text-primary-foreground/60">Avg. ROI</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link to="/signup">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-6">
                Join the Revolution
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-bold">
                See How It Works
              </Button>
            </a>
          </div>
        </div>

        {/* Hero images */}
        <div className="relative">
          <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl" />
          <div className="relative grid grid-cols-5 gap-3">
            <img
              src={heroFarm}
              alt="Aerial view of digital farmland at golden hour"
              width={1280}
              height={1024}
              className="col-span-3 rounded-3xl shadow-2xl border-4 border-accent/20 object-cover w-full h-[280px] md:h-[420px]"
            />
            <img
              src={heroSecondary}
              alt="Farmer checking crop analytics on a phone"
              loading="lazy"
              width={768}
              height={1024}
              className="col-span-2 rounded-3xl shadow-2xl border-4 border-accent/20 object-cover w-full h-[280px] md:h-[420px]"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
