import { ArrowLeft, MapPin, Clock, Briefcase, Heart, Zap, Globe, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const jobs = [
  { title: "Senior Frontend Engineer", location: "Remote (Global)", type: "Full-time", dept: "Engineering", desc: "Own the mobile-first experience for millions of farmers. React, TypeScript, Tailwind." },
  { title: "Product Designer", location: "Lagos, Nigeria", type: "Full-time", dept: "Design", desc: "Shape how farmers, investors, and admins experience the platform end-to-end." },
  { title: "Community Manager", location: "Remote (Africa)", type: "Full-time", dept: "Growth", desc: "Grow and nurture our farmer community across WhatsApp, Telegram, and in-person meetups." },
  { title: "Blockchain Developer", location: "Remote (Global)", type: "Full-time", dept: "Engineering", desc: "Design and audit the NDC token economy and on-chain settlement layer." },
  { title: "Agricultural Field Officer", location: "Kaduna, Nigeria", type: "Full-time", dept: "Operations", desc: "Onboard and support farm co-ops. Verify yields on the ground." },
  { title: "Data Analyst", location: "Remote", type: "Full-time", dept: "Analytics", desc: "Turn platform data into insight that improves farmer outcomes and investor returns." },
];

const perks = [
  { icon: Globe, title: "Remote-first", desc: "Work from anywhere. Quarterly team meetups on us." },
  { icon: Heart, title: "Full health cover", desc: "Private health insurance for you and your dependents." },
  { icon: Zap, title: "NDC equity", desc: "Every full-time hire gets an NDC allocation that vests over 4 years." },
  { icon: Users, title: "Learning budget", desc: "$1,500/year for courses, conferences, and books." },
];

const CareersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 py-8 space-y-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-display font-extrabold text-foreground">Careers</h1>
        </div>

        <div className="space-y-3">
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            We're building the financial layer for sustainable farming across Africa. If you want your work to fund real farms, reach real communities, and outlast trends — you'll fit right in.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-display font-extrabold text-foreground mb-4">Why Marco Net</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {perks.map(p => (
              <Card key={p.title} className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-4 space-y-2">
                  <p.icon className="h-5 w-5 text-accent" />
                  <h3 className="font-bold text-[13px] text-foreground">{p.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-display font-extrabold text-foreground mb-4">Open roles</h2>
          <div className="space-y-3">
            {jobs.map((j) => (
              <Card key={j.title} className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-4">
                  <h3 className="font-bold text-[14px] text-foreground">{j.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{j.desc}</p>
                  <div className="flex flex-wrap gap-3 mt-2.5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {j.type}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {j.dept}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast({ title: "Application received", description: `Thanks for your interest in ${j.title}. We'll be in touch within 5 business days.` })} className="mt-3 text-xs font-bold h-8 rounded-xl border-border/60">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border border-border/60 shadow-premium rounded-2xl">
          <CardContent className="p-5 space-y-2 text-center">
            <h3 className="font-display font-bold text-foreground">Don't see your role?</h3>
            <p className="text-[12px] text-muted-foreground">We're always open to exceptional people. Email <a href="mailto:careers@marconet.app" className="text-primary font-semibold">careers@marconet.app</a> with what you'd bring.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareersPage;
