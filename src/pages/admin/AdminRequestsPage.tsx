import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
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
      // Fetch profile names for request user_ids
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
    // Update request status
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

    // If approved, insert role
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
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Access Requests</h1>
          <p className="text-sm text-muted-foreground">{requests.length} pending requests</p>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending admin requests
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <Card key={req.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{profiles[req.user_id] || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">
                        Requested {new Date(req.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  {req.reason && (
                    <p className="text-sm text-muted-foreground">{req.reason}</p>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAction(req, true)}>
                      <Check className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleAction(req, false)}>
                      <X className="h-3 w-3 mr-1" /> Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRequestsPage;
