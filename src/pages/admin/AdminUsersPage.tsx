import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

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
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">{profiles.length} registered users</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-foreground">{p.full_name || "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground">{p.phone || "No phone"}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">{p.ndc_balance.toLocaleString()} NDC</Badge>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">No users found</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
