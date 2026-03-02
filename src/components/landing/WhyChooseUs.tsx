import { Shield, Eye, Coins, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: Shield, title: "Own Your Data", desc: "Your farming data stays yours. Full control, full transparency." },
  { icon: Coins, title: "Earn Every Action", desc: "Every stake, every harvest — your actions generate real NDC value." },
  { icon: Eye, title: "Transparent Yield", desc: "See exactly where your returns come from. No hidden fees." },
  { icon: Leaf, title: "Sustainable Growth", desc: "Invest in projects that are both profitable and environmentally responsible." },
];

const WhyChooseUs = () => (
  <section className="py-20 bg-background">
    <div className="container max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Why Choose Marco Net Farming</h2>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Built for farmers and investors who value trust, transparency, and real returns.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {benefits.map((b) => (
          <Card key={b.title} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-card">
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <b.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
