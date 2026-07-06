import { UserPlus, Sprout, Layers, Wallet } from "lucide-react";
import howItWorksImg from "@/assets/how-it-works.jpg";

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

      <div className="grid lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-2 relative">
          <div className="absolute -inset-3 bg-primary/10 rounded-3xl blur-2xl" />
          <img
            src={howItWorksImg}
            alt="Farmer using a smartphone in a green field"
            loading="lazy"
            width={1024}
            height={768}
            className="relative rounded-3xl shadow-xl object-cover w-full h-[340px]"
          />
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-[11px] font-extrabold flex items-center justify-center shadow">
                  {i + 1}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
