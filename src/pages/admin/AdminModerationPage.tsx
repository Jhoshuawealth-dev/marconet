import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
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
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Moderation</h1>
          <p className="text-sm text-muted-foreground">{posts.length} pending posts</p>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending posts to review
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{post.title}</p>
                      <p className="text-xs text-muted-foreground">
                        by {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{post.topic}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.body}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAction(post.id, "approved")}>
                      <Check className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleAction(post.id, "rejected")}>
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

export default AdminModerationPage;
