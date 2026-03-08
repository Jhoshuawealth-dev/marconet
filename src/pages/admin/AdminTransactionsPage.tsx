import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, DollarSign, Coins, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const totalVolume = txs.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const inflow = txs.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const outflow = txs.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-extrabold text-foreground">Transaction Oversight</h1>
          <p className="text-[12px] text-muted-foreground font-medium mt-1">All platform NDC transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-5 w-5 text-primary mx-auto mb-1.5" />
              <p className="text-lg font-display font-extrabold text-foreground text-metric">{totalVolume.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Total Volume</p>
            </CardContent>
          </Card>
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1.5" />
              <p className="text-lg font-display font-extrabold text-primary text-metric">+{inflow.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Inflow</p>
            </CardContent>
          </Card>
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-5 w-5 text-destructive mx-auto mb-1.5" />
              <p className="text-lg font-display font-extrabold text-destructive text-metric">-{outflow.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Outflow</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by title or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 rounded-xl border-border/60 shadow-premium text-[13px]"
          />
        </div>

        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-border/60 rounded-2xl animate-pulse">
                <CardContent className="p-4 h-14" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((tx) => (
              <Card key={tx.id} className="border border-border/60 shadow-premium rounded-2xl hover:shadow-elevated transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    tx.amount >= 0 ? "bg-primary/10" : "bg-destructive/10"
                  )}>
                    <Coins className={cn("h-4 w-4", tx.amount >= 0 ? "text-primary" : "text-destructive")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{tx.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString()}
                      {tx.description && ` · ${tx.description}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn(
                      "text-[14px] font-bold text-metric",
                      tx.amount >= 0 ? "text-primary" : "text-destructive"
                    )}>
                      {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString()} NDC
                    </p>
                    <Badge className="bg-muted text-muted-foreground border-0 text-[9px] font-bold rounded-md mt-0.5">
                      {tx.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <Card className="border border-border/60 rounded-2xl">
                <CardContent className="py-12 text-center">
                  <Coins className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[12px] text-muted-foreground">No transactions found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionsPage;
