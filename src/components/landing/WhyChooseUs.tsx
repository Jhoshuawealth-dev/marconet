import { Shield, Eye, Coins, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import benefitOwnData from "@/assets/benefit-own-data.jpg";
import benefitEarn from "@/assets/benefit-earn.jpg";
import benefitTransparent from "@/assets/benefit-transparent.jpg";
import benefitSustainable from "@/assets/benefit-sustainable.jpg";

const benefits = [
  { icon: Shield, image: benefitOwnData, title: "Own Your Data", desc: "Your farming data stays yours. Full control, full transparency." },
  { icon: Coins, image: benefitEarn, title: "Earn Every Action", desc: "Every stake, every harvest — your actions generate real NDC value." },
  { icon: Eye, image: benefitTransparent, title: "Transparent Yield", desc: "See exactly where your returns come from. No hidden fees." },
  { icon: Leaf, image: benefitSustainable, title: "Sustainable Growth", desc: "Invest in projects that are both profitable and environmentally responsible." },
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
          <Card key={b.title} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-card">
            <div className="relative h-40 overflow-hidden">
              <img
                src={b.image}
                alt={b.title}
                loading="lazy"
                width={768}
                height={768}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-primary/90 backdrop-blur flex items-center justify-center shadow-lg">
                <b.icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <CardContent className="p-5 space-y-2">
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
