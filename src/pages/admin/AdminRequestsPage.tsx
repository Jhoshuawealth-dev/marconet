import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ShieldCheck, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminRequest {
  id: string;
  user_id: string;
  status: string;
  reason: string | null;
  requested_at: string;
}

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("admin_requests")
      .select("*")
      .eq("status", "pending")
      .order("requested_at", { ascending: true });
    if (data) {
      setRequests(data);
      const userIds = data.map((r) => r.user_id);
      if (userIds.length > 0) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", userIds);
        if (profs) {
          const map: Record<string, string> = {};
          profs.forEach((p) => { map[p.user_id] = p.full_name || "Unnamed"; });
          setProfiles(map);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (req: AdminRequest, approved: boolean) => {
    const { error: updateError } = await supabase
      .from("admin_requests")
      .update({
        status: approved ? "approved" : "rejected",
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", req.id);

    if (updateError) {
      toast({ title: "Error", description: updateError.message, variant: "destructive" });
      return;
    }

    if (approved) {
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: req.user_id, role: "admin" as any });
      if (roleError) {
        toast({ title: "Error adding role", description: roleError.message, variant: "destructive" });
        return;
      }
    }

    toast({ title: approved ? "Request approved" : "Request rejected" });
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">Admin Access Requests</h1>
            <p className="text-[12px] text-muted-foreground font-medium mt-1">Manage who gets admin privileges</p>
          </div>
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-[13px] font-bold text-foreground text-metric">{requests.length}</span>
              <span className="text-[10px] text-muted-foreground font-medium">Pending</span>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Card key={i} className="border border-border/60 rounded-2xl animate-pulse">
                <CardContent className="p-5 h-28" />
              </Card>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <p className="text-[14px] font-bold text-foreground">No pending requests</p>
              <p className="text-[12px] text-muted-foreground mt-1">All admin requests have been reviewed</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const name = profiles[req.user_id] || "Unknown";
              return (
                <Card key={req.id} className="border border-border/60 shadow-premium rounded-2xl hover:shadow-elevated transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold">
                          {name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-foreground">{name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Requested {new Date(req.requested_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-accent/10 text-accent border-0 text-[10px] font-bold rounded-lg">Pending</Badge>
                    </div>
                    {req.reason && (
                      <p className="text-[12px] text-muted-foreground leading-relaxed bg-muted/40 p-3 rounded-xl">
                        "{req.reason}"
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(req, true)}
                        className="gradient-primary text-primary-foreground rounded-xl text-[11px] font-bold h-9 px-4 shadow-sm"
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(req, false)}
                        className="rounded-xl text-[11px] font-bold h-9 px-4 border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-3.5 w-3.5 mr-1.5" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRequestsPage;
