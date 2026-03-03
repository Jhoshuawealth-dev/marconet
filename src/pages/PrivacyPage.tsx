import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-extrabold text-foreground">Privacy Policy</h1>
        </div>
        <p className="text-xs text-muted-foreground">Last updated: March 1, 2026</p>
        {[
          { title: "1. Information We Collect", body: "We collect information you provide directly, including name, email, and identity documents for KYC verification. We also collect usage data and device information automatically." },
          { title: "2. How We Use Your Information", body: "Your information is used to provide and improve our services, process transactions, verify identity, communicate updates, and ensure platform security." },
          { title: "3. Data Sharing", body: "We do not sell your personal data. We may share information with service providers, regulatory authorities, and as required by law." },
          { title: "4. Data Security", body: "We implement industry-standard encryption, secure storage, and access controls to protect your data. All KYC documents are encrypted at rest and in transit." },
          { title: "5. Your Rights", body: "You have the right to access, correct, or delete your personal data. Contact us at privacy@marconet.farm to exercise these rights." },
          { title: "6. Contact", body: "For privacy-related inquiries, contact our Data Protection Officer at privacy@marconet.farm." },
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

export default PrivacyPage;
