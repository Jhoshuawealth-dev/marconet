import { useEffect, useState } from "react";
import { ArrowLeft, Copy, Users, Gift, Check, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/app/BottomNav";
import PageTransition from "@/components/app/PageTransition";

const ReferralsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState<string>("");
  const [claimed, setClaimed] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [count, setCount] = useState(0);
  const [earned, setEarned] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from("profiles" as any)
        .select("referral_code, referral_bonus_claimed").eq("user_id", user.id).single();
      if (p) {
        setCode((p as any).referral_code || "");
        setClaimed(!!(p as any).referral_bonus_claimed);
      }
      const { data: refs } = await supabase.from("referrals" as any)
        .select("bonus_amount").eq("referrer_id", user.id);
      if (refs) {
        setCount((refs as any[]).length);
        setEarned((refs as any[]).reduce((s, r: any) => s + (r.bonus_amount || 0), 0));
      }
    })();
  }, [user]);

  const link = `${window.location.origin}/signup?ref=${code}`;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast({ title: "Copied to clipboard" });
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Join Marco Net", text: `Use my referral code ${code} to get 100 NDC bonus!`, url: link }); } catch {}
    } else copy(link);
  };

  const applyCode = async () => {
    if (!inputCode.trim()) return;
    setApplying(true);
    const { data, error } = await supabase.rpc("apply_referral_code" as any, { _code: inputCode.trim() });
    setApplying(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    const res = data as any;
    if (!res?.ok) return toast({ title: "Cannot apply", description: res?.error, variant: "destructive" });
    toast({ title: "Bonus applied 🎁", description: `You received ${res.referee_bonus} NDC.` });
    setClaimed(true);
    setInputCode("");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="app-container px-5 pt-6 space-y-6">
          <div className="flex items-center gap-3">
            <Link to="/profile"><ArrowLeft className="h-5 w-5 text-foreground" /></Link>
            <h1 className="text-xl font-display font-extrabold text-foreground">Refer & Earn</h1>
          </div>

          <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated rounded-3xl overflow-hidden relative">
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
            <CardContent className="p-6 relative z-10 space-y-2">
              <Gift className="h-6 w-6 text-accent" />
              <h2 className="text-lg font-display font-extrabold">Earn 200 NDC per friend</h2>
              <p className="text-[12px] text-primary-foreground/70">They get 100 NDC when they sign up with your code. No cap on referrals.</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 text-center">
                <Users className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-lg font-display font-extrabold text-foreground text-metric">{count}</p>
                <p className="text-[10px] text-muted-foreground">Friends Joined</p>
              </CardContent>
            </Card>
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 text-center">
                <Gift className="h-5 w-5 text-accent mx-auto mb-1.5" />
                <p className="text-lg font-display font-extrabold text-foreground text-metric">{earned}</p>
                <p className="text-[10px] text-muted-foreground">NDC Earned</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <Label className="text-[12px] font-bold">Your referral code</Label>
              <div className="flex gap-2">
                <Input readOnly value={code} className="rounded-xl font-mono font-bold tracking-wider text-center" />
                <Button size="icon" variant="outline" onClick={() => copy(code)} className="rounded-xl border-border/60">
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Label className="text-[12px] font-bold pt-2">Invite link</Label>
              <div className="flex gap-2">
                <Input readOnly value={link} className="rounded-xl text-[11px]" />
                <Button size="icon" variant="outline" onClick={() => copy(link)} className="rounded-xl border-border/60">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={share} className="w-full h-11 rounded-2xl gradient-primary font-bold gap-2">
                <Share2 className="h-4 w-4" /> Share invite
              </Button>
            </CardContent>
          </Card>

          {!claimed && (
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-[13px] text-foreground">Have a referral code?</h3>
                  <p className="text-[11px] text-muted-foreground">Enter it once to claim your 100 NDC welcome bonus.</p>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="MN123ABC" value={inputCode} onChange={e => setInputCode(e.target.value.toUpperCase())}
                    className="rounded-xl font-mono uppercase" />
                  <Button onClick={applyCode} disabled={applying || !inputCode.trim()} className="rounded-xl font-bold">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default ReferralsPage;
