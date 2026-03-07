import { useState } from "react";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useNdc, NDC_RATES } from "@/contexts/NdcContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageTransition from "@/components/app/PageTransition";

type Currency = "GBP" | "USD" | "NGN";
const currencySymbols: Record<Currency, string> = { GBP: "£", USD: "$", NGN: "₦" };

const TransferPage = () => {
  const navigate = useNavigate();
  const { balance, spend } = useNdc();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [success, setSuccess] = useState(false);

  const num = parseInt(amount) || 0;
  const convertedValue = num * NDC_RATES[currency];
  const fee = convertedValue * 0.05;
  const netReceived = convertedValue - fee;
  const sym = currencySymbols[currency];

  const handleTransfer = () => {
    if (!recipient.trim()) { toast({ title: "Missing recipient", variant: "destructive" }); return; }
    if (!num || num <= 0) { toast({ title: "Invalid amount", variant: "destructive" }); return; }
    const ok = spend(num, "Transfer", `Sent ${sym}${netReceived.toLocaleString()} to ${recipient} (5% fee: ${sym}${fee.toLocaleString()})`);
    if (!ok) { toast({ title: "Insufficient balance", variant: "destructive" }); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="max-w-md mx-auto px-5 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-display font-extrabold text-foreground">Transfer Successful!</h2>
            <p className="text-[13px] text-muted-foreground">{num.toLocaleString()} NDC sent to <strong className="text-foreground">{recipient}</strong></p>
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 space-y-1.5 text-[12px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Converted</span><span className="font-bold text-metric">{sym}{convertedValue.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">5% Fee</span><span className="font-bold text-destructive text-metric">-{sym}{fee.toLocaleString()}</span></div>
                <div className="flex justify-between border-t pt-1.5"><span className="text-muted-foreground">Recipient gets</span><span className="font-bold text-primary text-metric">{sym}{netReceived.toLocaleString()}</span></div>
              </CardContent>
            </Card>
            <p className="text-lg font-display font-bold text-foreground text-metric">Balance: {balance.toLocaleString()} NDC</p>
            <Button onClick={() => navigate("/wallet")} className="w-full rounded-2xl font-bold h-12 gradient-primary border-0 shadow-sm">Back to Wallet</Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
            <h1 className="text-xl font-display font-extrabold text-foreground">Transfer NDC</h1>
          </div>

          <p className="text-[13px] text-muted-foreground">Available: <strong className="text-foreground text-metric">{balance.toLocaleString()} NDC</strong></p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-foreground">Recipient</label>
              <Input placeholder="Wallet address or username" value={recipient} onChange={e => setRecipient(e.target.value)} className="h-12 rounded-2xl bg-muted/50 border-border/60" />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-foreground">Amount (NDC)</label>
              <Input type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} className="h-12 rounded-2xl text-lg font-bold bg-muted/50 border-border/60 text-metric" />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-foreground">Destination Currency</label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger className="h-12 rounded-2xl border-border/60"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="GBP">🇬🇧 GBP (£) — 1 NDC = £{NDC_RATES.GBP}</SelectItem>
                  <SelectItem value="USD">🇺🇸 USD ($) — 1 NDC = ${NDC_RATES.USD}</SelectItem>
                  <SelectItem value="NGN">🇳🇬 NGN (₦) — 1 NDC = ₦{NDC_RATES.NGN.toLocaleString()}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-[12px]"><span className="text-muted-foreground">NDC Amount</span><span className="font-bold text-foreground text-metric">{num.toLocaleString()} NDC</span></div>
                <div className="flex justify-between text-[12px]"><span className="text-muted-foreground">Converted Value</span><span className="font-bold text-foreground text-metric">{sym}{convertedValue.toLocaleString()}</span></div>
                <div className="flex justify-between text-[12px]"><span className="text-muted-foreground">Transfer Fee (5%)</span><span className="font-bold text-destructive text-metric">-{sym}{fee.toLocaleString()}</span></div>
                <div className="flex justify-between text-[12px] border-t pt-2"><span className="font-bold text-foreground">Recipient Receives</span><span className="font-bold text-primary text-metric">{sym}{netReceived.toLocaleString()}</span></div>
              </CardContent>
            </Card>
          </div>

          <Button onClick={handleTransfer} size="lg" className="w-full font-bold text-[15px] h-[52px] rounded-2xl gap-2 gradient-primary border-0 shadow-elevated transition-all active:scale-[0.98]">
            <Send className="h-4 w-4" /> Send Transfer
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default TransferPage;
