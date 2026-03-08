import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface Transaction {
  id: string;
  user_id: string;
  title: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
}

const AdminTransactionsPage = () => {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("ndc_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (data) setTxs(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = txs.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transaction Oversight</h1>
          <p className="text-sm text-muted-foreground">All platform NDC transactions</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by title or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((tx) => (
              <Card key={tx.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-foreground">{tx.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                    {tx.description && (
                      <p className="text-xs text-muted-foreground">{tx.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.amount >= 0 ? "text-primary" : "text-destructive"}`}>
                      {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString()} NDC
                    </p>
                    <Badge variant="outline" className="text-xs">{tx.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">No transactions found</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionsPage;
