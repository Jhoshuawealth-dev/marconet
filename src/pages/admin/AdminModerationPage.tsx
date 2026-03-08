import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, MessageSquare, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  body: string;
  author_name: string;
  status: string;
  created_at: string;
  topic: string;
}

const AdminModerationPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("community_posts")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleAction = async (id: string, status: string) => {
    const { error } = await supabase.from("community_posts").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "approved" ? "Post approved" : "Post rejected" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">Content Moderation</h1>
            <p className="text-[12px] text-muted-foreground font-medium mt-1">Review and manage community content</p>
          </div>
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-[13px] font-bold text-foreground text-metric">{posts.length}</span>
              <span className="text-[10px] text-muted-foreground font-medium">Pending</span>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Card key={i} className="border border-border/60 rounded-2xl animate-pulse">
                <CardContent className="p-5 h-32" />
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <p className="text-[14px] font-bold text-foreground">All clear!</p>
              <p className="text-[12px] text-muted-foreground mt-1">No pending posts to review</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} className="border border-border/60 shadow-premium rounded-2xl hover:shadow-elevated transition-shadow">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shrink-0">
                        {post.author_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-foreground">{post.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          by {post.author_name} · {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-accent/10 text-accent border-0 text-[10px] font-bold rounded-lg">{post.topic}</Badge>
                  </div>
                  <p className="text-[12px] text-muted-foreground line-clamp-3 leading-relaxed">{post.body}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAction(post.id, "approved")}
                      className="gradient-primary text-primary-foreground rounded-xl text-[11px] font-bold h-9 px-4 shadow-sm"
                    >
                      <Check className="h-3.5 w-3.5 mr-1.5" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(post.id, "rejected")}
                      className="rounded-xl text-[11px] font-bold h-9 px-4 border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" /> Reject
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

export default AdminModerationPage;
