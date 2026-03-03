import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-extrabold text-foreground">Terms of Service</h1>
        </div>
        <p className="text-xs text-muted-foreground">Effective: March 1, 2026</p>
        {[
          { title: "1. Acceptance of Terms", body: "By accessing or using Marco Net Farming, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform." },
          { title: "2. Platform Services", body: "Marco Net Farming provides digital farming investment tools, NDC token management, community features, and educational resources. All investments carry inherent risk." },
          { title: "3. User Responsibilities", body: "You are responsible for maintaining account security, providing accurate information, and complying with applicable laws. You must complete KYC verification to access investment features." },
          { title: "4. NDC Tokens", body: "NDC tokens represent digital yield within the platform. Token values may fluctuate. Past performance does not guarantee future results." },
          { title: "5. Limitation of Liability", body: "Marco Net Farming is not liable for investment losses, service interruptions, or third-party actions. Use the platform at your own risk." },
          { title: "6. Governing Law", body: "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved through arbitration." },
        ].map((s) => (
          <div key={s.title}>
            <h2 className="font-bold text-foreground text-sm">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsPage;
