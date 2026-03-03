import { useState } from "react";
import { ArrowLeft, ArrowRight, Megaphone, Link2, Leaf, MapPin, ChevronRight, DollarSign, Calendar, ImagePlus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const steps = ["Goal", "Audience", "Budget", "Creative"];

const goals = [
  { id: "awareness", title: "Brand Awareness", desc: "Help people discover your farm or products.", icon: Megaphone },
  { id: "traffic", title: "Website Traffic", desc: "Drive more visitors to your online shop or blog.", icon: Link2 },
  { id: "leads", title: "Lead Generation", desc: "Collect contact info from interested farmers.", icon: Leaf },
];

const interests = ["Sustainable Farming", "Agri-Tech", "Grain Markets", "Rural Finance", "Irrigation"];

const durations = ["7 Days", "30 Days", "Continuous", "Custom"];

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState("awareness");
  const [selectedDuration, setSelectedDuration] = useState("7 Days");
  const [headline, setHeadline] = useState("");
  const [primaryText, setPrimaryText] = useState("");

  const progress = ((step + 1) / steps.length) * 100;

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate("/ads");
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else navigate("/ads");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <button onClick={back}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
            <h1 className="font-extrabold text-foreground">
              {step === 0 ? "New Campaign" : step === 1 ? "Ad Campaign" : step === 2 ? "Create Ad Campaign" : "Finalize Campaign"}
            </h1>
            <span className="text-xs font-bold text-primary">STEP {step + 1}/{steps.length}</span>
          </div>
          <div className="text-xs text-muted-foreground mb-1">
            {step === 0 ? "Campaign progress" : step === 1 ? "Step 2: Seed your Audience" : step === 2 ? "Budget & Schedule" : "Final Step: Creative & Review"}
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">What is your goal?</h2>
                <p className="text-sm text-muted-foreground mt-1">Select the objective that best fits your campaign needs.</p>
              </div>
              <div className="space-y-3">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-colors ${
                      selectedGoal === g.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      g.id === "awareness" ? "bg-accent/15" : g.id === "traffic" ? "bg-secondary/30" : "bg-primary/10"
                    }`}>
                      <g.icon className={`h-5 w-5 ${g.id === "awareness" ? "text-accent" : g.id === "traffic" ? "text-secondary" : "text-primary"}`} />
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
                <p className="text-sm text-muted-foreground mt-1">Choose the best soil for your ads to grow.</p>
              </div>

              <Card className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-foreground">Target Regions</h3>
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="h-32 bg-muted rounded-xl flex items-center justify-center text-xs text-muted-foreground">
                    🗺️ Map Preview — Central Valley, CA
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="font-bold text-sm text-foreground mb-2">Audience Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {interests.map((int) => (
                    <button key={int} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                      {int}
                    </button>
                  ))}
                  <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                    + Explore More
                  </button>
                </div>
              </div>

              <Card className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground">Age Range</h3>
                    <span className="text-xs font-bold text-primary">25 - 55+</span>
                  </div>
                  <div className="mt-3 h-1.5 bg-muted rounded-full relative">
                    <div className="absolute left-[20%] right-[10%] h-full bg-primary rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Daily Budget</h2>
                <p className="text-sm text-muted-foreground mt-1">Set how much you want to spend each day.</p>
              </div>

              <Card className="border shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="text-3xl font-extrabold text-foreground">25.00</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Estimated Reach</p>
                  <p className="text-2xl font-extrabold text-foreground mt-1">1,240 - 3,500 <span className="text-sm font-normal text-muted-foreground">People / day</span></p>
                  <div className="flex gap-6 mt-2 text-xs text-muted-foreground">
                    <div>CLICKS <p className="font-bold text-foreground">45 - 120</p></div>
                    <div>GROWTH RANK <p className="font-bold text-foreground">Top 15% 📈</p></div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-xl font-extrabold text-foreground">Schedule</h2>
                <p className="text-sm text-muted-foreground mt-1">Select the duration for your campaign.</p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Card className="border shadow-sm">
                    <CardContent className="p-3">
                      <p className="text-[10px] text-muted-foreground uppercase">Start Date</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-bold text-foreground">03/03/2026</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border shadow-sm">
                    <CardContent className="p-3">
                      <p className="text-[10px] text-muted-foreground uppercase">End Date</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-bold text-foreground">04/03/2026</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex gap-2 mt-3">
                  {durations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDuration(d)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${selectedDuration === d ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Upload Ad Creative</h2>
              </div>
              <Card className="border-2 border-dashed border-border">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <ImagePlus className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-bold text-sm text-foreground">Add Image or Video</p>
                  <p className="text-[10px] text-muted-foreground">Recommended: 1080×1080px (JPG, PNG, MP4)</p>
                  <Button size="sm" className="font-bold text-xs rounded-xl">Select Media</Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-foreground">Ad Content</h2>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Headline</Label>
                  <Input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Fresh Organic Tomatoes"
                    className="h-10 rounded-xl"
                    maxLength={40}
                  />
                  <p className="text-[10px] text-muted-foreground text-right">{headline.length}/40</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Primary Text</Label>
                  <textarea
                    value={primaryText}
                    onChange={(e) => setPrimaryText(e.target.value)}
                    placeholder="Describe what you are offering to the community..."
                    className="w-full h-20 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground text-center">
                By launching this campaign, you agree to Marco Net Farming's Advertising Policies and Community Guidelines.
              </p>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-4 pb-6 pt-2 flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={back} className="font-bold rounded-xl h-12">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {step === 0 && (
            <Button variant="outline" onClick={() => navigate("/ads")} className="flex-1 font-bold rounded-xl h-12">Cancel</Button>
          )}
          <Button onClick={next} className="flex-1 font-bold text-base h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            {step === 3 ? "🚀 Launch Campaign" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
