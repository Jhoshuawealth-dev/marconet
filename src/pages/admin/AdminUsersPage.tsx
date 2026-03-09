import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  ndc_balance: number;
  created_at: string;
}

const AdminUsersPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (data) setProfiles(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = profiles.filter(
    (p) =>
      (p.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.phone ?? "").includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">User Management</h1>
            <p className="text-[12px] text-muted-foreground font-medium mt-1">{profiles.length} registered users</p>
          </div>
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-bold text-foreground text-metric">{profiles.length}</span>
              <span className="text-[10px] text-muted-foreground font-medium">Total</span>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 rounded-xl border-border/60 shadow-premium text-[13px]"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-border/60 rounded-2xl animate-pulse">
                <CardContent className="p-4 h-16" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((p) => (
              <Card key={p.id} className="border border-border/60 shadow-premium rounded-2xl hover:shadow-elevated transition-shadow">
                <CardContent className="p-4">
                  <Link to={`/admin/users/${p.id}`} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold shadow-sm">
                      {(p.full_name || "U").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-foreground truncate">{p.full_name || "Unnamed"}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {p.phone || "No phone"} · Joined {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="gradient-accent text-accent-foreground border-0 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {p.ndc_balance.toLocaleString()} NDC
                    </Badge>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <Card className="border border-border/60 rounded-2xl">
                <CardContent className="py-12 text-center">
                  <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[12px] text-muted-foreground">No users found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
