import { useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Camera, ShieldCheck, Lock, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const idTypes = [
  { id: "gov", title: "Government ID", desc: "National ID card or equivalent", icon: BadgeCheck },
  { id: "passport", title: "Passport", desc: "Standard international passport", icon: BookOpen },
  { id: "license", title: "Driver's License", desc: "Valid state or national license", icon: ShieldCheck },
];

const steps = ["ID Selection", "Document Scan", "Liveness Check"];

const VerificationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState("gov");
  const progress = ((step + 1) / steps.length) * 100;

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setStep(3); // done
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          <div className="px-4 pt-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
              <h1 className="font-extrabold text-foreground">Verification Status</h1>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-6">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-16 w-16 text-primary" />
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/20 text-accent-foreground uppercase">
              ⏳ Pending Review
            </span>
            <h2 className="text-2xl font-extrabold text-foreground">Verification in Progress</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your Digital Farm is being prepared. Our team is currently reviewing your documents to ensure a secure environment for all farmers. You will be notified within <span className="text-primary font-bold">24 hours</span>.
            </p>

            <div className="grid grid-cols-3 gap-3 w-full">
              {[
                { icon: Lock, label: "SSL SECURED" },
                { icon: ShieldCheck, label: "GDPR COMPLIANT" },
                { icon: CheckCircle, label: "ID VERIFIED" },
              ].map((b) => (
                <Card key={b.label} className="border shadow-sm">
                  <CardContent className="p-3 text-center">
                    <b.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">{b.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="px-4 pb-6">
            <Button onClick={() => navigate("/dashboard")} className="w-full font-bold text-base h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}>
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="font-extrabold text-foreground">{step < 2 ? "Identity Verification" : "KYC Verification"}</h1>
          </div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-primary">Step {step + 1}: {steps[step]}</span>
            <span className="text-muted-foreground">{step + 1} of {steps.length}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-6">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Select ID Type</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  To ensure a safe and trusted farming community for everyone, please select your preferred form of identification.
                </p>
              </div>
              <div className="space-y-3">
                {idTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-colors ${
                      selectedId === t.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <t.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-foreground">{t.title}</p>
                      <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedId === t.id ? "border-primary bg-primary" : "border-border"
                    }`}>
                      {selectedId === t.id && <CheckCircle className="h-3.5 w-3.5 text-primary-foreground" />}
                    </div>
                  </button>
                ))}
              </div>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-3 flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Your data is encrypted and stored securely. We only use this information to verify your identity as part of our community safety guidelines.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-extrabold text-foreground">Position your ID within the frame</h2>
                <p className="text-sm text-muted-foreground">Center your document to scan automatically</p>
              </div>
              <div className="aspect-[4/3] bg-foreground/10 rounded-2xl border-2 border-primary flex items-center justify-center">
                <div className="text-center text-muted-foreground space-y-2">
                  <Camera className="h-12 w-12 mx-auto text-primary/40" />
                  <p className="text-xs">Camera preview area</p>
                </div>
              </div>
              <Card className="bg-muted">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm">💡</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">Tips for a good photo</p>
                    <p className="text-[10px] text-muted-foreground">Avoid glare and use good lighting for faster verification.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 text-center">
              <h2 className="text-2xl font-extrabold text-foreground">Selfie Verification</h2>
              <p className="text-sm text-muted-foreground">Position your face within the circle</p>
              <div className="w-48 h-48 rounded-full border-4 border-primary mx-auto bg-muted flex items-center justify-center">
                <Camera className="h-12 w-12 text-primary/30" />
              </div>
              <Card className="bg-muted/50 mx-auto max-w-xs">
                <CardContent className="p-3 text-center">
                  <p className="text-sm font-bold text-primary">Smile and look at the camera</p>
                </CardContent>
              </Card>
              <div className="flex justify-center gap-3">
                <span className="text-xs flex items-center gap-1 text-primary font-semibold"><CheckCircle className="h-3.5 w-3.5" /> Face detected</span>
                <span className="text-xs flex items-center gap-1 text-primary font-semibold"><CheckCircle className="h-3.5 w-3.5" /> Good lighting</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-6">
          <Button onClick={next} className="w-full font-bold text-base h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            {step === 2 ? "Submit Verification" : "Continue"} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
