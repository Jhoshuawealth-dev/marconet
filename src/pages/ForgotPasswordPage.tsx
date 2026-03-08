import { useState } from "react";
import { Leaf, ArrowRight, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/app/PageTransition";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-accent/[0.04] blur-3xl" />

        <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-premium">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-[15px] text-foreground">Marco Net</span>
              </div>
              <div>
                <h1 className="text-[26px] font-display font-extrabold text-foreground leading-tight">
                  {sent ? "Check your email" : "Reset Password"}
                </h1>
                <p className="text-[14px] text-muted-foreground mt-1.5">
                  {sent
                    ? `We've sent a password reset link to ${email}`
                    : "Enter your email and we'll send you a reset link"}
                </p>
              </div>
            </div>

            {sent ? (
              <div className="text-center space-y-4">
                <Mail className="h-16 w-16 text-primary mx-auto" />
                <p className="text-[13px] text-muted-foreground">
                  Didn't receive it?{" "}
                  <button onClick={() => setSent(false)} className="text-primary font-bold">Try again</button>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[13px] font-semibold text-foreground">Email address</Label>
                  <Input id="email" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="h-12 rounded-2xl bg-muted/50 border-border/60 text-[14px] focus:bg-card" />
                </div>

                <Button type="submit" size="lg" disabled={loading}
                  className="w-full font-display font-bold text-[15px] h-[52px] rounded-2xl gradient-primary border-0 shadow-elevated gap-2 transition-all active:scale-[0.98]">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send Reset Link <ArrowRight className="h-4 w-4" /></>}
                </Button>
              </form>
            )}

            <p className="text-center text-[13px] text-muted-foreground">
              Remember your password?{" "}
              <Link to="/signin" className="text-primary font-bold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPasswordPage;
