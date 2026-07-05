import { useState } from "react";
import { ArrowLeft, Lock, Smartphone, Shield, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/app/PageTransition";

const SecurityPage = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast({ title: "Missing fields", description: "Please fill all password fields.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Mismatch", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    toast({ title: "Password Updated 🔒", description: "Your password has been changed successfully." });
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        <div className="app-container px-4 pt-6 space-y-5">
          <div className="flex items-center gap-3">
            <Link to="/profile"><ArrowLeft className="h-5 w-5 text-foreground" /></Link>
            <h1 className="text-xl font-extrabold text-foreground">Security & 2FA</h1>
          </div>

          {/* Change Password */}
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Change Password</h3>
              </div>
              {[
                { label: "Current Password", value: currentPassword, set: setCurrentPassword },
                { label: "New Password", value: newPassword, set: setNewPassword },
                { label: "Confirm New Password", value: confirmPassword, set: setConfirmPassword },
              ].map(f => (
                <div key={f.label} className="space-y-1.5">
                  <Label className="text-xs font-semibold">{f.label}</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={f.value}
                      onChange={e => f.set(e.target.value)}
                      className="rounded-xl h-10 pr-10"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <Button onClick={handleChangePassword} className="w-full font-bold rounded-xl h-10">Update Password</Button>
            </CardContent>
          </Card>

          {/* 2FA Toggle */}
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Two-Factor Authentication</p>
                    <p className="text-[10px] text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch checked={twoFAEnabled} onCheckedChange={(v) => {
                  setTwoFAEnabled(v);
                  toast({ title: v ? "2FA Enabled 🛡️" : "2FA Disabled", description: v ? "Two-factor authentication is now active." : "Two-factor authentication has been turned off." });
                }} />
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Active Sessions</h3>
              </div>
              {[
                { device: "iPhone 15 Pro", location: "Lagos, NG", time: "Now", current: true },
                { device: "MacBook Pro", location: "Lagos, NG", time: "2h ago", current: false },
              ].map(s => (
                <div key={s.device} className="flex items-center justify-between py-2 border-b last:border-0 border-border">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{s.device} {s.current && <span className="text-primary">(Current)</span>}</p>
                    <p className="text-[10px] text-muted-foreground">{s.location} · {s.time}</p>
                  </div>
                  {!s.current && <Button variant="ghost" size="sm" className="text-destructive text-[10px] h-7">Revoke</Button>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default SecurityPage;
