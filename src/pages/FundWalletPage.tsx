import { useState } from "react";
import { ArrowLeft, CreditCard, Smartphone, Building2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useNdc } from "@/contexts/NdcContext";
import { useToast } from "@/hooks/use-toast";

const methods = [
  { id: "card", label: "Debit Card", icon: CreditCard },
  { id: "transfer", label: "Bank Transfer", icon: Building2 },
  { id: "ussd", label: "USSD", icon: Smartphone },
];

const FundWalletPage = () => {
  const navigate = useNavigate();
  const { balance, earn } = useNdc();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [success, setSuccess] = useState(false);

  const presets = [500, 1000, 2000, 5000];

  const handleFund = () => {
    const num = parseInt(amount);
    if (!num || num <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }
    earn(num, "Wallet Funded", `Added ${num} NDC via ${methods.find(m => m.id === method)?.label}`);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="app-container px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">Funding Successful!</h2>
          <p className="text-sm text-muted-foreground">{parseInt(amount).toLocaleString()} NDC has been added to your wallet.</p>
          <p className="text-lg font-bold text-foreground">New Balance: {balance.toLocaleString()} NDC</p>
          <Button onClick={() => navigate("/wallet")} className="w-full rounded-xl font-bold">Back to Wallet</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="app-container px-4 pt-6 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-xl font-extrabold text-foreground">Fund Wallet</h1>
        </div>

        <p className="text-sm text-muted-foreground">Current Balance: <strong className="text-foreground">{balance.toLocaleString()} NDC</strong></p>

        {/* Amount */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground">Amount (NDC)</label>
          <Input type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} className="h-12 rounded-xl text-lg font-bold" />
          <div className="flex gap-2">
            {presets.map(p => (
              <button key={p} onClick={() => setAmount(p.toString())}
                className="flex-1 text-xs font-semibold py-2 rounded-xl bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                {p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground">Payment Method</label>
          {methods.map(m => (
            <Card key={m.id} className={`border shadow-sm cursor-pointer transition-colors ${method === m.id ? "border-primary bg-primary/5" : ""}`}
              onClick={() => setMethod(m.id)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === m.id ? "bg-primary/10" : "bg-muted"}`}>
                  <m.icon className={`h-5 w-5 ${method === m.id ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <span className="font-bold text-sm text-foreground">{m.label}</span>
                {method === m.id && <CheckCircle className="h-4 w-4 text-primary ml-auto" />}
              </CardContent>
            </Card>
          ))}
        </div>

        <Button onClick={handleFund} size="lg" className="w-full font-bold text-base h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
          Fund Wallet
        </Button>
      </div>
    </div>
  );
};

export default FundWalletPage;
