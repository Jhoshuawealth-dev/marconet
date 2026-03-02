import { UserPlus, Sprout, Layers, Wallet } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create Account", desc: "Sign up in seconds and join the farming community." },
  { icon: Sprout, title: "Farm Data", desc: "Start your digital farm, sow seeds, and generate data yield." },
  { icon: Layers, title: "Stake in Projects", desc: "Invest your NDC into verified farmland projects for returns." },
  { icon: Wallet, title: "Withdraw or Reinvest", desc: "Harvest your earnings or compound them for bigger yields." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-muted/50">
    <div className="container max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">How It Works</h2>
        <p className="mt-3 text-muted-foreground">Four simple steps to start earning.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <div key={s.title} className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <s.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-xs font-extrabold flex items-center justify-center shadow">
                {i + 1}
              </span>
            </div>
            <h3 className="font-bold text-foreground text-lg">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
