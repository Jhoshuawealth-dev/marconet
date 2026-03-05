import { useState } from "react";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useNdc, NDC_RATES } from "@/contexts/NdcContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    if (!recipient.trim()) {
      toast({ title: "Missing recipient", description: "Please enter a wallet address or username.", variant: "destructive" });
      return;
    }
    if (!num || num <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }
    const ok = spend(num, "Transfer", `Sent ${sym}${netReceived.toLocaleString()} to ${recipient} (${currency}, 5% fee: ${sym}${fee.toLocaleString()})`);
    if (!ok) {
      toast({ title: "Insufficient balance", description: "You don't have enough NDC for this transfer.", variant: "destructive" });
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">Transfer Successful!</h2>
          <p className="text-sm text-muted-foreground">{num.toLocaleString()} NDC sent to <strong>{recipient}</strong></p>
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Converted</span><span className="font-bold">{sym}{convertedValue.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">5% Fee</span><span className="font-bold text-destructive">-{sym}{fee.toLocaleString()}</span></div>
              <div className="flex justify-between border-t pt-1"><span className="text-muted-foreground">Recipient gets</span><span className="font-bold text-primary">{sym}{netReceived.toLocaleString()}</span></div>
            </CardContent>
          </Card>
          <p className="text-lg font-bold text-foreground">New Balance: {balance.toLocaleString()} NDC</p>
          <Button onClick={() => navigate("/wallet")} className="w-full rounded-xl font-bold">Back to Wallet</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-xl font-extrabold text-foreground">Transfer NDC</h1>
        </div>

        <p className="text-sm text-muted-foreground">Available: <strong className="text-foreground">{balance.toLocaleString()} NDC</strong></p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Recipient</label>
            <Input placeholder="Wallet address or username" value={recipient} onChange={e => setRecipient(e.target.value)} className="h-12 rounded-xl" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Amount (NDC)</label>
            <Input type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} className="h-12 rounded-xl text-lg font-bold" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Destination Currency</label>
            <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GBP">🇬🇧 GBP (£) — 1 NDC = £{NDC_RATES.GBP}</SelectItem>
                <SelectItem value="USD">🇺🇸 USD ($) — 1 NDC = ${NDC_RATES.USD}</SelectItem>
                <SelectItem value="NGN">🇳🇬 NGN (₦) — 1 NDC = ₦{NDC_RATES.NGN.toLocaleString()}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fee breakdown */}
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">NDC Amount</span>
                <span className="font-bold text-foreground">{num.toLocaleString()} NDC</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Converted Value</span>
                <span className="font-bold text-foreground">{sym}{convertedValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Transfer Fee (5%)</span>
                <span className="font-bold text-destructive">-{sym}{fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs border-t pt-2">
                <span className="font-bold text-foreground">Recipient Receives</span>
                <span className="font-bold text-primary">{sym}{netReceived.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleTransfer} size="lg" className="w-full font-bold text-base h-12 rounded-xl gap-2">
          <Send className="h-4 w-4" /> Send Transfer
        </Button>
      </div>
    </div>
  );
};

export default TransferPage;
