import { ArrowLeft, Sprout, Users, Shield, Globe, Target, Heart, TrendingUp, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";

const stats = [
  { icon: Users, title: "12,400+", desc: "Active farmers" },
  { icon: Shield, title: "100%", desc: "Transparent yields" },
  { icon: Globe, title: "18", desc: "Countries served" },
  { icon: TrendingUp, title: "₦2.4B+", desc: "Community value" },
];

const values = [
  { icon: Heart, title: "Community First", desc: "Every decision serves the farmers, investors, and communities who make Marco Net possible." },
  { icon: Shield, title: "Radical Transparency", desc: "Every yield, every fee, every transaction is on-record. No black boxes." },
  { icon: Leaf, title: "Sustainable by Design", desc: "We fund only regenerative and eco-positive agriculture." },
  { icon: Target, title: "Long-Term Thinking", desc: "We build for decades, not quarters. Farming is generational work." },
];

const team = [
  { name: "Adaeze Okoro", role: "Founder & CEO", bio: "Former agtech investor. 10+ years scaling farming co-ops across West Africa." },
  { name: "Marco Da Silva", role: "CTO", bio: "Ex-Stripe engineer. Built payment rails serving 40M+ users." },
  { name: "Fatima Bello", role: "Head of Agriculture", bio: "PhD, Soil Science. Advised the UN FAO on sustainable yield programs." },
  { name: "Kwame Mensah", role: "Head of Community", bio: "Grew our farmer network from 200 to 12k in two years." },
];

const timeline = [
  { year: "2023", event: "Marco Net founded in Lagos with 3 pilot farms." },
  { year: "2024", event: "Launched NDC digital currency and first 500 investors onboarded." },
  { year: "2025", event: "Crossed 10,000 farmers and expanded to Ghana, Kenya, and Rwanda." },
  { year: "2026", event: "Rolled out community governance, education hub, and referral rewards." },
];

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 py-8 space-y-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-display font-extrabold text-foreground">About Marco Net</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-elevated">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">Marco Net Farming</span>
          </div>
          <img
            src="/src/assets/hero-farm.jpg"
            alt="Aerial view of Marco Net digital farmlands"
            loading="lazy"
            className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-premium"
          />
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Marco Net is a digital farming and investment platform built on a simple belief: the people who grow the food should share in the wealth it creates. We combine sustainable agriculture with modern technology so farmers, investors, and everyday communities can grow together — transparently and profitably.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <Card key={s.title} className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 text-center">
                <s.icon className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-lg font-display font-extrabold text-foreground">{s.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-display font-extrabold text-foreground">Our mission</h2>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            To democratize agricultural investment and make sustainable farming accessible to anyone with a phone. We do this by tokenizing real farmland yields, giving every participant a voice through governance, and reinvesting profit into community programs.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-display font-extrabold text-foreground">What we stand for</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {values.map((v) => (
              <Card key={v.title} className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-4 space-y-2">
                  <v.icon className="h-5 w-5 text-accent" />
                  <h3 className="font-bold text-[13px] text-foreground">{v.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-display font-extrabold text-foreground">Leadership</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {team.map((t) => (
              <Card key={t.name} className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="font-bold text-[13px] text-foreground">{t.name}</h3>
                  <p className="text-[11px] text-primary font-semibold">{t.role}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{t.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-display font-extrabold text-foreground">Our story</h2>
          <div className="space-y-3">
            {timeline.map((t) => (
              <div key={t.year} className="flex gap-4">
                <div className="w-14 shrink-0 font-display font-extrabold text-primary text-[15px]">{t.year}</div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{t.event}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="border border-border/60 shadow-premium rounded-2xl gradient-primary text-primary-foreground">
          <CardContent className="p-6 text-center space-y-3">
            <h2 className="text-lg font-display font-extrabold">Ready to grow with us?</h2>
            <p className="text-[12px] text-primary-foreground/80">Join thousands earning from real, sustainable farmland yields.</p>
            <Link to="/signup"><Button className="rounded-2xl font-bold bg-primary-foreground text-primary hover:bg-primary-foreground/90">Create your account</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
