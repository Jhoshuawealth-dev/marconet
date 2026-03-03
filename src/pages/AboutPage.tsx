import { ArrowLeft, Sprout, Users, Shield, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-extrabold text-foreground">About Us</h1>
        </div>
        <div className="flex items-center gap-3">
          <Sprout className="h-10 w-10 text-primary" />
          <span className="text-xl font-bold text-foreground">Marco Net Farming</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Marco Net Farming is a digital farming and investment platform that combines sustainable agriculture with cutting-edge technology. We empower farmers, investors, and communities to grow together through transparent, trust-driven digital farmlands.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Users, title: "12,400+ Farmers", desc: "A growing global community" },
            { icon: Shield, title: "100% Transparent", desc: "Verified yields & audited returns" },
            { icon: Globe, title: "Sustainable Impact", desc: "Eco-friendly digital agriculture" },
          ].map((v) => (
            <Card key={v.title} className="border shadow-sm">
              <CardContent className="p-4 text-center">
                <v.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-bold text-sm text-foreground">{v.title}</h3>
                <p className="text-[10px] text-muted-foreground mt-1">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-foreground">Our Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To democratize agricultural investment and make sustainable farming accessible to everyone through technology, transparency, and community governance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
