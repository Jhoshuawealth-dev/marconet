import { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useNdc } from "@/contexts/NdcContext";
import { useToast } from "@/hooks/use-toast";

const projectMeta: Record<string, { name: string; roi: number; months: number }> = {
  "1": { name: "Green Valley Soy", roi: 18.5, months: 6 },
  "2": { name: "Sunrise Maize Field", roi: 22, months: 4 },
  "3": { name: "Cassava Digital Farm", roi: 15.2, months: 8 },
  "4": { name: "Rice Paddy Project", roi: 20, months: 5 },
  "5": { name: "Cocoa Bean Estate", roi: 25, months: 12 },
};

const StakePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const projectId = id || "1";
  const meta = projectMeta[projectId] || { name: "Project", roi: 15, months: 6 };
  const projectName = meta.name;
  const { balance, stakeProject, stakedProjects } = useNdc();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const presets = [100, 500, 1000, 2500];
  const currentStake = stakedProjects[projectId] || 0;

  const handleStake = () => {
    const num = parseInt(amount);
    if (!num || num <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    const ok = stakeProject(projectId, num, { projectName, roiPercent: meta.roi, durationMonths: meta.months });
    if (!ok) {
      toast({ title: "Insufficient balance", description: `You need ${num} NDC but have ${balance.toLocaleString()} NDC.`, variant: "destructive" });
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="app-container px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">Stake Successful!</h2>
          <p className="text-sm text-muted-foreground">You staked {parseInt(amount).toLocaleString()} NDC in <strong>{projectName}</strong></p>
          <p className="text-lg font-bold text-foreground">Remaining Balance: {balance.toLocaleString()} NDC</p>
          <div className="flex gap-3">
            <Button onClick={() => navigate(`/invest/${projectId}`)} variant="outline" className="flex-1 rounded-xl font-bold">View Project</Button>
            <Button onClick={() => navigate("/invest")} className="flex-1 rounded-xl font-bold">Back to Invest</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="app-container px-4 pt-6 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-xl font-extrabold text-foreground">Stake in {projectName}</h1>
        </div>

        <Card className="border shadow-sm">
          <CardContent className="p-4 flex justify-between">
            <div><p className="text-xs text-muted-foreground">Available Balance</p><p className="text-lg font-extrabold text-foreground">{balance.toLocaleString()} NDC</p></div>
            <div className="text-right"><p className="text-xs text-muted-foreground">Current Stake</p><p className="text-lg font-extrabold text-primary">{currentStake.toLocaleString()} NDC</p></div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground">Stake Amount (NDC)</label>
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

        <Button onClick={handleStake} size="lg" className="w-full font-bold text-base h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
          🌱 Confirm Stake
        </Button>
      </div>
    </div>
  );
};

export default StakePage;
