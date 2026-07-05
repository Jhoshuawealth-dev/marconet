import { useEffect, useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/app/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PersonalInfoPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user.id)
        .maybeSingle();
      setForm({
        fullName: data?.full_name || (user.user_metadata as any)?.full_name || "",
        email: user.email || "",
        phone: data?.phone || (user.user_metadata as any)?.phone || "",
      });
      setLoading(false);
    })();
  }, [user]);

  const update = (key: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.fullName.trim(), phone: form.phone.trim() })
      .eq("user_id", user.id);
    if (!error) {
      await supabase.auth.updateUser({ data: { full_name: form.fullName.trim(), phone: form.phone.trim() } });
    }
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Profile Updated ✅", description: "Your personal information has been saved." });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        <div className="app-container px-4 pt-6 space-y-5">
          <div className="flex items-center gap-3">
            <Link to="/profile"><ArrowLeft className="h-5 w-5 text-foreground" /></Link>
            <h1 className="text-xl font-extrabold text-foreground">Personal Information</h1>
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Full Name</Label>
                <Input
                  value={form.fullName}
                  onChange={e => update("fullName", e.target.value)}
                  className="rounded-xl h-10"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Email Address</Label>
                <Input
                  type="email"
                  value={form.email}
                  disabled
                  className="rounded-xl h-10 bg-muted/40"
                />
                <p className="text-[10px] text-muted-foreground">Email cannot be changed here.</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Phone Number</Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                  className="rounded-xl h-10"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="w-full font-bold rounded-xl h-12 gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Changes</>}
          </Button>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default PersonalInfoPage;
