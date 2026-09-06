import { useEffect, useState } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import PageTransition from "@/components/app/PageTransition";

const AdminLoginPage = () => {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();

  useEffect(() => {
    if (user && !roleLoading && isAdmin) navigate("/admin", { replace: true });
  }, [user, isAdmin, roleLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setLoading(false);
      toast({ title: "Sign in failed", description: error?.message, variant: "destructive" });
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);

    const list = (roles ?? []).map((r: { role: string }) => r.role);
    setLoading(false);

    if (list.includes("admin") || list.includes("super_admin")) {
      navigate("/admin", { replace: true });
    } else {
      await supabase.auth.signOut();
      toast({
        title: "Not an admin account",
        description: "This account does not have admin access.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col justify-center app-container relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-accent/[0.04] blur-3xl" />

        <div className="px-6 relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-premium">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-[26px] font-extrabold text-foreground">Admin sign in</h1>
              <p className="text-[13px] text-muted-foreground mt-1">
                Restricted area — administrator credentials required.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-[12px] font-semibold">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-[12px] font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl gradient-primary font-bold">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>Enter admin panel <ArrowRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between text-[12px]">
            <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground font-medium">
              Forgot password?
            </Link>
            <Link to="/signin" className="text-primary font-semibold">
              User sign in
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminLoginPage;
