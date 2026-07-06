import { Users, Coins, Radio, ShieldCheck } from "lucide-react";
import statsBg from "@/assets/stats-bg.jpg";

const stats = [
  { icon: Users, value: "12,400+", label: "Lifetime Farmers" },
  { icon: Coins, value: "₦8.2M", label: "Total NDC Paid" },
  { icon: Radio, value: "3,200+", label: "Live Streams Completed" },
  { icon: ShieldCheck, value: "99.9%", label: "Uptime & Trust" },
];

const StatsBar = () => (
  <section className="relative py-16 bg-primary text-primary-foreground overflow-hidden">
    <img
      src={statsBg}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/70" />
    <div className="container max-w-6xl mx-auto relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label} className="space-y-2">
            <s.icon className="h-7 w-7 mx-auto text-accent" />
            <p className="text-2xl md:text-3xl font-extrabold">{s.value}</p>
            <p className="text-xs text-primary-foreground/70">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsBar;
