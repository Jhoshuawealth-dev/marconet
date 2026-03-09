import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, Shield, Bell, Eye, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlatformSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
}

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<Record<string, any>>({
    maintenance_mode: false,
    registration_enabled: true,
    community_posts_enabled: true,
    education_enrollment_fee: 200,
    max_stake_amount: 100000,
    platform_announcement: "",
    auto_approve_posts: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("platform_settings").select("*");
      
      if (data) {
        const settingsMap = data.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as Record<string, any>);
        
        setSettings(prev => ({ ...prev, ...settingsMap }));
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const updateSetting = async (key: string, value: any) => {
    const { error } = await supabase
      .from("platform_settings")
      .upsert({
        key,
        value,
        description: getSettingDescription(key)
      }, {
        onConflict: 'key'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      await Promise.all(
        Object.entries(settings).map(([key, value]) => updateSetting(key, value))
      );
      
      toast({
        title: "Settings Saved",
        description: "Platform settings have been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save some settings",
        variant: "destructive"
      });
    }
    
    setSaving(false);
  };

  const getSettingDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      maintenance_mode: "Put the platform in maintenance mode",
      registration_enabled: "Allow new user registrations",
      community_posts_enabled: "Enable community posting feature",
      education_enrollment_fee: "Fee in NDC for course enrollment",
      max_stake_amount: "Maximum NDC amount that can be staked per project",
      platform_announcement: "Global announcement shown to all users",
      auto_approve_posts: "Automatically approve all community posts"
    };
    return descriptions[key] || "";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-20" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">Platform Settings</h1>
            <p className="text-[12px] text-muted-foreground font-medium mt-1">
              Configure global platform settings and features
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="gradient-primary text-primary-foreground border-0 shadow-premium gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* System Settings */}
        <Card className="border border-border/60 shadow-premium rounded-2xl">
          <CardHeader>
            <CardTitle className="text-[15px] font-display font-extrabold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[13px] font-bold text-foreground">Maintenance Mode</Label>
                <p className="text-[11px] text-muted-foreground">Temporarily disable access to the platform</p>
              </div>
              <Switch
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenance_mode: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[13px] font-bold text-foreground">New Registrations</Label>
                <p className="text-[11px] text-muted-foreground">Allow new users to create accounts</p>
              </div>
              <Switch
                checked={settings.registration_enabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, registration_enabled: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-foreground">Platform Announcement</Label>
              <Textarea
                placeholder="Enter a global announcement for all users..."
                value={settings.platform_announcement}
                onChange={(e) => setSettings(prev => ({ ...prev, platform_announcement: e.target.value }))}
                className="min-h-20 rounded-xl border-border/60 text-[13px]"
              />
              <p className="text-[10px] text-muted-foreground">Leave empty to disable announcements</p>
            </div>
          </CardContent>
        </Card>

        {/* Community Settings */}
        <Card className="border border-border/60 shadow-premium rounded-2xl">
          <CardHeader>
            <CardTitle className="text-[15px] font-display font-extrabold flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Community Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[13px] font-bold text-foreground">Community Posts</Label>
                <p className="text-[11px] text-muted-foreground">Enable users to create community posts</p>
              </div>
              <Switch
                checked={settings.community_posts_enabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, community_posts_enabled: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[13px] font-bold text-foreground">Auto-Approve Posts</Label>
                <p className="text-[11px] text-muted-foreground">Automatically approve all community posts</p>
              </div>
              <Switch
                checked={settings.auto_approve_posts}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_approve_posts: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card className="border border-border/60 shadow-premium rounded-2xl">
          <CardHeader>
            <CardTitle className="text-[15px] font-display font-extrabold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Financial Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-foreground">Education Enrollment Fee</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={settings.education_enrollment_fee}
                  onChange={(e) => setSettings(prev => ({ ...prev, education_enrollment_fee: parseInt(e.target.value) || 0 }))}
                  className="w-32 rounded-xl border-border/60 text-[13px]"
                />
                <span className="text-[12px] text-muted-foreground font-medium">NDC</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Cost for users to enroll in courses</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-foreground">Maximum Stake Amount</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={settings.max_stake_amount}
                  onChange={(e) => setSettings(prev => ({ ...prev, max_stake_amount: parseInt(e.target.value) || 0 }))}
                  className="w-40 rounded-xl border-border/60 text-[13px]"
                />
                <span className="text-[12px] text-muted-foreground font-medium">NDC</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Maximum amount users can stake per project</p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="border border-border/60 shadow-premium rounded-2xl">
          <CardHeader>
            <CardTitle className="text-[15px] font-display font-extrabold flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Settings updated", user: "Admin", time: "2 minutes ago" },
                { action: "Community post approved", user: "Admin", time: "15 minutes ago" },
                { action: "User registration disabled", user: "Super Admin", time: "1 hour ago" },
                { action: "Maintenance mode enabled", user: "Super Admin", time: "3 hours ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div>
                    <p className="text-[12px] font-bold text-foreground">{activity.action}</p>
                    <p className="text-[10px] text-muted-foreground">by {activity.user}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;