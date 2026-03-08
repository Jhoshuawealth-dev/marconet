import { useState, useEffect } from "react";
import { Leaf, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/app/PageTransition";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    if (type === "recovery") {
      setIsRecovery(true);
    }

    // Also listen for auth state change with recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Failed to reset password", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
      toast({ title: "Password updated! 🎉" });
      setTimeout(() => navigate("/dashboard"), 2000);
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
                  {success ? "Password Updated" : "Set New Password"}
                </h1>
                <p className="text-[14px] text-muted-foreground mt-1.5">
                  {success ? "You can now sign in with your new password." : "Enter your new password below."}
                </p>
              </div>
            </div>

            {success ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-primary mx-auto" />
                <p className="text-[13px] text-muted-foreground">Redirecting to dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[13px] font-semibold text-foreground">New Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPw ? "text" : "password"} placeholder="Min. 6 characters"
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="h-12 rounded-2xl bg-muted/50 border-border/60 text-[14px] pr-11 focus:bg-card" />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[13px] font-semibold text-foreground">Confirm Password</Label>
                  <Input id="confirmPassword" type={showPw ? "text" : "password"} placeholder="Confirm your password"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-2xl bg-muted/50 border-border/60 text-[14px] focus:bg-card" />
                </div>

                <Button type="submit" size="lg" disabled={loading}
                  className="w-full font-display font-bold text-[15px] h-[52px] rounded-2xl gradient-primary border-0 shadow-elevated gap-2 transition-all active:scale-[0.98]">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Update Password <ArrowRight className="h-4 w-4" /></>}
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

export default ResetPasswordPage;
