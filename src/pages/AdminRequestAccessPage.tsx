import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/app/PageTransition";

const AdminRequestAccessPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [existing, setExisting] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data } = await supabase
        .from("admin_requests")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setExisting(data);
      setLoading(false);
    };
    check();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("admin_requests").insert({
      user_id: user.id,
      reason: reason || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request submitted", description: "A super admin will review your request." });
      setExisting({ status: "pending" });
    }
    setSubmitting(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-4 app-container">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <Card>
          <CardHeader className="text-center">
            <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-2" />
            <CardTitle>Request Admin Access</CardTitle>
            <CardDescription>Submit a request to become a platform administrator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground text-sm">Loading...</p>
            ) : existing ? (
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">You already submitted a request</p>
                <Badge variant={existing.status === "approved" ? "default" : existing.status === "rejected" ? "destructive" : "secondary"}>
                  {existing.status}
                </Badge>
              </div>
            ) : (
              <>
                <Textarea
                  placeholder="Why do you need admin access? (optional)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
                <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default AdminRequestAccessPage;
