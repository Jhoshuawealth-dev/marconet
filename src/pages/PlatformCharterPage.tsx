import { ArrowLeft, Sprout, Shield, Users, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const PlatformCharterPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-extrabold text-foreground">Platform Charter</h1>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Marco Net Farming Platform Charter outlines our core values, governance principles, and commitment to the community.
        </p>
        <div className="space-y-4">
          {[
            { icon: Sprout, title: "Sustainability First", body: "We prioritize environmentally sustainable farming practices in all digital farmland projects. Every investment is vetted for ecological impact." },
            { icon: Shield, title: "Trust & Transparency", body: "All yields are audited and verified. Financial reports are published quarterly. Smart contracts ensure automated, fair distribution." },
            { icon: Users, title: "Community Governance", body: "Platform decisions are made through community voting. Every verified farmer has a voice. Tier-based voting weight ensures experienced voices are heard." },
            { icon: Scale, title: "Fair & Inclusive", body: "We are committed to financial inclusion. Low minimum investment thresholds ensure everyone can participate in digital farming." },
          ].map((v) => (
            <Card key={v.title} className="border shadow-sm">
              <CardContent className="p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{v.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{v.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformCharterPage;
