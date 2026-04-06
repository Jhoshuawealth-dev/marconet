import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationRequest {
  id: string;
  user_id: string;
  id_type: string;
  document_url: string | null;
  selfie_url: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  profile?: { full_name: string | null };
}

const AdminVerificationPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<VerificationRequest | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("verification_requests" as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      const rows = data as any[];
      const userIds = [...new Set(rows.map((r: any) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);
      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);
      setRequests(rows.map((r: any) => ({ ...r, profile: profileMap.get(r.user_id) || { full_name: null } })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
    const channel = supabase
      .channel("admin-verifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "verification_requests" }, () => fetchRequests())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("verification_requests" as any)
      .update({ status, reviewed_by: user.id, reviewed_at: new Date().toISOString() } as any)
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Verification ${status}` });
      setSelected(null);
      fetchRequests();
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600",
      approved: "bg-green-500/10 text-green-600",
      rejected: "bg-red-500/10 text-red-600",
    };
    return <Badge className={`${styles[status] || ""} border-0 text-[9px] font-bold px-2 py-0.5 rounded-lg`}>{status}</Badge>;
  };

  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">KYC Verification</h1>
            <p className="text-[12px] text-muted-foreground font-medium mt-1">
              {pending} pending review{pending !== 1 ? "s" : ""}
            </p>
          </div>
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-bold text-foreground">{pending}</span>
              <span className="text-[10px] text-muted-foreground font-medium">Pending</span>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-border/60 rounded-2xl animate-pulse"><CardContent className="p-4 h-16" /></Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {requests.map((r) => (
              <Card key={r.id} className="border border-border/60 shadow-premium rounded-2xl hover:shadow-elevated transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold shadow-sm">
                    {(r.profile?.full_name || "U").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{r.profile?.full_name || "Unknown"}</p>
                    <p className="text-[10px] text-muted-foreground">{r.id_type} · {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  {statusBadge(r.status)}
                  <Button size="sm" variant="outline" onClick={() => setSelected(r)} className="text-[11px] gap-1">
                    <Eye className="h-3 w-3" /> Review
                  </Button>
                </CardContent>
              </Card>
            ))}
            {requests.length === 0 && (
              <Card className="border border-border/60 rounded-2xl">
                <CardContent className="py-12 text-center">
                  <ShieldCheck className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[12px] text-muted-foreground">No verification requests</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Review Verification</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-[13px]">
                  <div><span className="text-muted-foreground">Name:</span> <span className="font-bold">{selected.profile?.full_name || "Unknown"}</span></div>
                  <div><span className="text-muted-foreground">ID Type:</span> <span className="font-bold">{selected.id_type}</span></div>
                  <div><span className="text-muted-foreground">Status:</span> {statusBadge(selected.status)}</div>
                  <div><span className="text-muted-foreground">Submitted:</span> <span className="font-bold">{new Date(selected.created_at).toLocaleDateString()}</span></div>
                </div>

                {selected.document_url && (
                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-1">Document</p>
                    <img src={selected.document_url} alt="Document" className="w-full rounded-xl border" />
                  </div>
                )}
                {selected.selfie_url && (
                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-1">Selfie</p>
                    <img src={selected.selfie_url} alt="Selfie" className="w-full max-w-[200px] rounded-xl border" />
                  </div>
                )}

                {selected.status === "pending" && (
                  <div className="flex gap-3">
                    <Button onClick={() => updateStatus(selected.id, "approved")} className="flex-1 bg-green-600 hover:bg-green-700 text-primary-foreground gap-1">
                      <CheckCircle className="h-4 w-4" /> Approve
                    </Button>
                    <Button onClick={() => updateStatus(selected.id, "rejected")} variant="destructive" className="flex-1 gap-1">
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminVerificationPage;
