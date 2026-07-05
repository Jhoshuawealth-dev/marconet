import { useState } from "react";
import { ArrowLeft, ArrowRight, Megaphone, Link2, Leaf, MapPin, DollarSign, Calendar, ImagePlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const steps = ["Goal", "Audience", "Budget", "Creative"];

const goals = [
  { id: "awareness", title: "Brand Awareness", desc: "Help people discover your farm or products.", icon: Megaphone },
  { id: "traffic", title: "Website Traffic", desc: "Drive more visitors to your online shop or blog.", icon: Link2 },
  { id: "leads", title: "Lead Generation", desc: "Collect contact info from interested farmers.", icon: Leaf },
];

const allInterests = ["Sustainable Farming", "Agri-Tech", "Grain Markets", "Rural Finance", "Irrigation"];

const durations: { label: string; days: number | null }[] = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "Continuous", days: null },
];

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [selectedGoal, setSelectedGoal] = useState("awareness");
  const [selectedDuration, setSelectedDuration] = useState(durations[0]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [dailyBudget, setDailyBudget] = useState(25);
  const [headline, setHeadline] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [name, setName] = useState("");

  const progress = ((step + 1) / steps.length) * 100;

  const toggleInterest = (i: string) =>
    setSelectedInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const launch = async () => {
    if (!user) return;
    if (!headline.trim()) {
      toast({ title: "Headline required", description: "Add a headline for your ad.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const start = new Date();
    const end = selectedDuration.days
      ? new Date(start.getTime() + selectedDuration.days * 86400000)
      : null;
    const total = selectedDuration.days ? dailyBudget * selectedDuration.days : 0;
    const { error } = await supabase.from("ad_campaigns" as any).insert({
      user_id: user.id,
      name: name.trim() || headline.trim().slice(0, 60),
      goal: selectedGoal,
      audience_interests: selectedInterests,
      daily_budget: dailyBudget,
      total_budget: total,
      headline: headline.trim(),
      primary_text: primaryText.trim(),
      duration_label: selectedDuration.label,
      start_date: start.toISOString().slice(0, 10),
      end_date: end ? end.toISOString().slice(0, 10) : null,
      status: "active",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not launch", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Campaign launched", description: "Your ad is now live." });
    navigate("/ads");
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else launch();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else navigate("/ads");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="app-container w-full flex-1 flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <button onClick={back}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
            <h1 className="font-extrabold text-foreground">New Campaign</h1>
            <span className="text-xs font-bold text-primary">STEP {step + 1}/{steps.length}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">What is your goal?</h2>
                <p className="text-sm text-muted-foreground mt-1">Select the objective that best fits your campaign.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Campaign Name (optional)</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Spring Soy Promo" className="h-10 rounded-xl" />
              </div>
              <div className="space-y-3">
                {goals.map((g) => (
                  <button key={g.id} onClick={() => setSelectedGoal(g.id)}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-colors ${
                      selectedGoal === g.id ? "border-primary bg-primary/5" : "border-border"
                    }`}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <g.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-foreground">{g.title}</p>
                      <p className="text-[10px] text-muted-foreground">{g.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedGoal === g.id ? "border-primary" : "border-border"
                    }`}>
                      {selectedGoal === g.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Define Your Reach</h2>
                <p className="text-sm text-muted-foreground mt-1">Pick the interests you want to target.</p>
              </div>
              <Card className="border shadow-sm">
                <CardContent className="p-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">All Regions</span>
                </CardContent>
              </Card>
              <div>
                <h3 className="font-bold text-sm text-foreground mb-2">Audience Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map((int) => {
                    const active = selectedInterests.includes(int);
                    return (
                      <button key={int} onClick={() => toggleInterest(int)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                          active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                        }`}>
                        {int}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Daily Budget</h2>
                <p className="text-sm text-muted-foreground mt-1">Set how much NDC to spend each day.</p>
              </div>
              <Card className="border shadow-sm">
                <CardContent className="p-5 flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <Input type="number" min={1} value={dailyBudget}
                    onChange={e => setDailyBudget(Math.max(1, parseInt(e.target.value) || 0))}
                    className="text-3xl font-extrabold border-0 focus-visible:ring-0 p-0 h-auto" />
                  <span className="text-sm font-semibold text-muted-foreground">NDC / day</span>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Estimated Reach</p>
                  <p className="text-2xl font-extrabold text-foreground mt-1">
                    {(dailyBudget * 50).toLocaleString()} - {(dailyBudget * 140).toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground"> people / day</span>
                  </p>
                </CardContent>
              </Card>
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Schedule</h2>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Card className="border shadow-sm">
                    <CardContent className="p-3">
                      <p className="text-[10px] text-muted-foreground uppercase">Start Date</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-bold text-foreground">{new Date().toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border shadow-sm">
                    <CardContent className="p-3">
                      <p className="text-[10px] text-muted-foreground uppercase">Duration</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-bold text-foreground">{selectedDuration.label}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {durations.map((d) => (
                    <button key={d.label} onClick={() => setSelectedDuration(d)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                        selectedDuration.label === d.label ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
                      }`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Ad Creative</h2>
              </div>
              <Card className="border-2 border-dashed border-border">
                <CardContent className="p-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <ImagePlus className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Media uploads coming soon — your text ad will run for now.</p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Headline *</Label>
                  <Input value={headline} onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Fresh Organic Tomatoes" className="h-10 rounded-xl" maxLength={40} />
                  <p className="text-[10px] text-muted-foreground text-right">{headline.length}/40</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Primary Text</Label>
                  <textarea value={primaryText} onChange={(e) => setPrimaryText(e.target.value)}
                    placeholder="Describe what you are offering..."
                    className="w-full h-20 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 pb-6 pt-2 flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={back} className="font-bold rounded-xl h-12">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {step === 0 && (
            <Button variant="outline" onClick={() => navigate("/ads")} className="flex-1 font-bold rounded-xl h-12">Cancel</Button>
          )}
          <Button onClick={next} disabled={submitting} className="flex-1 font-bold text-base h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            {step === 3 ? (submitting ? "Launching…" : "🚀 Launch Campaign") : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
