import { ArrowLeft, Shield, Vote, Award, ChevronRight, User, Lock, Sprout, Leaf, LogOut, Moon, Sun, ShieldCheck, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/app/BottomNav";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNdc } from "@/contexts/NdcContext";
import PageTransition from "@/components/app/PageTransition";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const settingsItems = [
  { icon: User, label: "Personal Information", to: "/profile/personal" },
  { icon: Lock, label: "Security & 2FA", to: "/profile/security" },
  { icon: Sprout, label: "Farm Assets", to: "/profile/farms" },
  { icon: Shield, label: "Identity Verification", to: "/verification" },
];

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { balance } = useNdc();
  const { isAdmin } = useAdminRole();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    if (!user) return;
    const fetchAvatar = async () => {
      const { data } = await supabase.from("profiles").select("avatar_url").eq("user_id", user.id).single();
      if (data?.avatar_url) setAvatarUrl(data.avatar_url);
    };
    fetchAvatar();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const path = `${user.id}/avatar-${Date.now()}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
      setAvatarUrl(urlData.publicUrl);
      toast({ title: "Profile photo updated ✅" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Farmer";
  const initials = displayName.slice(0, 2).toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-3">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="relative group" disabled={uploading}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-3xl object-cover shadow-elevated" />
              ) : (
                <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-extrabold text-xl shadow-elevated">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 rounded-3xl bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-5 w-5 text-background" />
              </div>
            </button>
            <div>
              <h1 className="text-xl font-display font-extrabold text-foreground">{displayName}</h1>
              <p className="text-[11px] text-muted-foreground mt-1">
                {user?.email}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Member since {memberSince}</p>
            </div>
          </div>

          {/* Balance Card */}
          <Card className="gradient-primary text-primary-foreground border-0 shadow-elevated rounded-3xl">
            <CardContent className="p-5 text-center">
              <p className="text-[11px] text-primary-foreground/60 font-medium tracking-wide uppercase">NDC Balance</p>
              <p className="text-2xl font-display font-extrabold mt-1 text-metric">{balance.toLocaleString()} NDC</p>
            </CardContent>
          </Card>

          {/* Governance Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 text-center">
                <Vote className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-lg font-display font-extrabold text-foreground text-metric">0</p>
                <p className="text-[10px] text-muted-foreground">Proposals Voted</p>
              </CardContent>
            </Card>
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-4 text-center">
                <Award className="h-5 w-5 text-accent mx-auto mb-1.5" />
                <p className="text-lg font-display font-extrabold text-foreground text-metric">0</p>
                <p className="text-[10px] text-muted-foreground">Governance Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Panel Link */}
          {isAdmin && (
            <Link to="/admin">
              <Card className="border border-primary/30 bg-primary/5 shadow-premium rounded-2xl mb-4">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span className="flex-1 text-[13px] font-semibold text-primary">Admin Panel</span>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Account Settings */}
          <div>
            <h2 className="font-display font-bold text-foreground text-[15px] mb-3">Account Settings</h2>
            <div className="space-y-2">
              {settingsItems.map((item) => (
                <Link key={item.label} to={item.to}>
                  <Card className="border border-border/60 shadow-premium rounded-2xl mb-2">
                    <CardContent className="p-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="flex-1 text-[13px] font-semibold text-foreground">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer links */}
          <div className="text-center space-y-2.5 pt-2">
            <Link to="/platform-charter" className="block text-[12px] text-primary font-semibold">Platform Charter</Link>
            <Link to="/terms" className="block text-[12px] text-muted-foreground">Code of Conduct</Link>
            <Button variant="ghost" onClick={handleSignOut}
              className="text-destructive text-[12px] font-bold mt-2 gap-1.5">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
