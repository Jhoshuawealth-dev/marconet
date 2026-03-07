import { useState } from "react";
import { Eye, EyeOff, Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "@/components/app/PageTransition";

const SignUpPage = () => {
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-accent/[0.04] blur-3xl" />

        <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
          <div className="space-y-8">
            {/* Logo & header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-premium">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-[15px] text-foreground">Marco Net</span>
              </div>
              <div>
                <h1 className="text-[26px] font-display font-extrabold text-foreground leading-tight">Create your account</h1>
                <p className="text-[14px] text-muted-foreground mt-1.5">Start your digital farming journey today</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[13px] font-semibold text-foreground">First name</Label>
                  <Input id="firstName" placeholder="John" className="h-12 rounded-2xl bg-muted/50 border-border/60 text-[14px] focus:bg-card" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[13px] font-semibold text-foreground">Last name</Label>
                  <Input id="lastName" placeholder="Farmer" className="h-12 rounded-2xl bg-muted/50 border-border/60 text-[14px] focus:bg-card" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-semibold text-foreground">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="h-12 rounded-2xl bg-muted/50 border-border/60 text-[14px] focus:bg-card" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[13px] font-semibold text-foreground">Phone number</Label>
                <Input id="phone" type="tel" placeholder="+234 800 000 0000" className="h-12 rounded-2xl bg-muted/50 border-border/60 text-[14px] focus:bg-card" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[13px] font-semibold text-foreground">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" className="h-12 rounded-2xl bg-muted/50 border-border/60 text-[14px] pr-11 focus:bg-card" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-primary font-medium">Terms of Service</Link>{" "}and{" "}
                <Link to="/privacy" className="text-primary font-medium">Privacy Policy</Link>.
              </p>

              <Button type="submit" size="lg" className="w-full font-display font-bold text-[15px] h-[52px] rounded-2xl gradient-primary border-0 shadow-elevated gap-2 transition-all active:scale-[0.98]">
                Create Account <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="text-center text-[13px] text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary font-bold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SignUpPage;
