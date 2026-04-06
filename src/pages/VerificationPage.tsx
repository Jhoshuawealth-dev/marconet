import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Camera, ShieldCheck, Lock, CheckCircle, Clock, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const idTypes = [
  { id: "gov", title: "Government ID", desc: "National ID card or equivalent", icon: BadgeCheck },
  { id: "passport", title: "Passport", desc: "Standard international passport", icon: BookOpen },
  { id: "license", title: "Driver's License", desc: "Valid state or national license", icon: ShieldCheck },
];

const steps = ["ID Selection", "Document Scan", "Liveness Check"];

const VerificationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState("gov");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [existingStatus, setExistingStatus] = useState<string | null>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const progress = ((step + 1) / steps.length) * 100;

  useEffect(() => {
    if (!user) return;
    const checkExisting = async () => {
      const { data } = await supabase
        .from("verification_requests" as any)
        .select("status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (data && (data as any[]).length > 0) {
        setExistingStatus((data as any[])[0].status);
      }
    };
    checkExisting();
  }, [user]);

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      setDocumentPreview(URL.createObjectURL(file));
    }
  };

  const handleSelfieSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!user || !documentFile || !selfieFile) return;
    setSubmitting(true);

    try {
      const docPath = `${user.id}/document-${Date.now()}`;
      const selfiePath = `${user.id}/selfie-${Date.now()}`;

      const [docUpload, selfieUpload] = await Promise.all([
        supabase.storage.from("kyc-documents").upload(docPath, documentFile),
        supabase.storage.from("kyc-documents").upload(selfiePath, selfieFile),
      ]);

      if (docUpload.error) throw docUpload.error;
      if (selfieUpload.error) throw selfieUpload.error;

      const docUrl = supabase.storage.from("kyc-documents").getPublicUrl(docPath).data.publicUrl;
      const selfieUrl = supabase.storage.from("kyc-documents").getPublicUrl(selfiePath).data.publicUrl;

      const { error } = await supabase.from("verification_requests" as any).insert({
        user_id: user.id,
        id_type: selectedId,
        document_url: docUrl,
        selfie_url: selfieUrl,
      } as any);

      if (error) throw error;

      setExistingStatus("pending");
      setStep(3);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (step === 1 && !documentFile) {
      toast({ title: "Please upload your document photo" });
      return;
    }
    if (step === 2) {
      if (!selfieFile) {
        toast({ title: "Please upload your selfie" });
        return;
      }
      handleSubmit();
      return;
    }
    if (step < steps.length - 1) setStep(step + 1);
  };

  // Show status if already submitted
  if (existingStatus || step === 3) {
    const status = existingStatus || "pending";
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
              {status === "approved" ? (
                <CheckCircle className="h-16 w-16 text-primary" />
              ) : status === "rejected" ? (
                <ShieldCheck className="h-16 w-16 text-destructive" />
              ) : (
                <Clock className="h-16 w-16 text-primary" />
              )}
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/20 text-accent-foreground uppercase">
              {status === "approved" ? "✅ Verified" : status === "rejected" ? "❌ Rejected" : "⏳ Pending Review"}
            </span>
            <h2 className="text-2xl font-extrabold text-foreground">
              {status === "approved" ? "Identity Verified" : status === "rejected" ? "Verification Rejected" : "Verification in Progress"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {status === "approved"
                ? "Your identity has been verified. You now have full access to all platform features."
                : status === "rejected"
                ? "Your verification was not approved. Please resubmit with clearer documents."
                : "Your Digital Farm is being prepared. Our team is reviewing your documents. You will be notified within 24 hours."}
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

          <div className="px-4 pb-6 space-y-2">
            {status === "rejected" && (
              <Button onClick={() => { setExistingStatus(null); setStep(0); setDocumentFile(null); setSelfieFile(null); }} className="w-full font-bold text-base h-12 rounded-xl gap-2">
                Resubmit Verification
              </Button>
            )}
            <Button onClick={() => navigate("/dashboard")} variant={status === "rejected" ? "outline" : "default"} className="w-full font-bold text-base h-12 rounded-xl gap-2">
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

        <div className="flex-1 px-4 py-6">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Select ID Type</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Select your preferred form of identification to verify your identity.
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
                    Your data is encrypted and stored securely. We only use this information to verify your identity.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-extrabold text-foreground">Upload your document</h2>
                <p className="text-sm text-muted-foreground">Take a clear photo of your {idTypes.find(t => t.id === selectedId)?.title}</p>
              </div>
              <input ref={docInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleDocumentSelect} />
              {documentPreview ? (
                <div className="space-y-3">
                  <img src={documentPreview} alt="Document" className="w-full rounded-2xl border-2 border-primary" />
                  <Button variant="outline" onClick={() => docInputRef.current?.click()} className="w-full gap-2">
                    <Camera className="h-4 w-4" /> Retake Photo
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => docInputRef.current?.click()}
                  className="w-full aspect-[4/3] bg-muted/30 rounded-2xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-12 w-12 text-primary/40" />
                  <p className="text-xs text-muted-foreground font-semibold">Tap to upload or take photo</p>
                </button>
              )}
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
              <p className="text-sm text-muted-foreground">Take a clear selfie photo</p>
              <input ref={selfieInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleSelfieSelect} />
              {selfiePreview ? (
                <div className="space-y-3">
                  <img src={selfiePreview} alt="Selfie" className="w-48 h-48 rounded-full border-4 border-primary mx-auto object-cover" />
                  <Button variant="outline" onClick={() => selfieInputRef.current?.click()} className="gap-2">
                    <Camera className="h-4 w-4" /> Retake Selfie
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => selfieInputRef.current?.click()}
                  className="w-48 h-48 rounded-full border-4 border-dashed border-primary/40 mx-auto bg-muted/30 flex items-center justify-center hover:bg-muted/50 transition-colors"
                >
                  <Camera className="h-12 w-12 text-primary/30" />
                </button>
              )}
              {selfiePreview && (
                <div className="flex justify-center gap-3">
                  <span className="text-xs flex items-center gap-1 text-primary font-semibold"><CheckCircle className="h-3.5 w-3.5" /> Photo uploaded</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-4 pb-6">
          <Button onClick={next} disabled={submitting} className="w-full font-bold text-base h-12 rounded-xl gap-2">
            {submitting ? "Submitting..." : step === 2 ? "Submit Verification" : "Continue"} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
