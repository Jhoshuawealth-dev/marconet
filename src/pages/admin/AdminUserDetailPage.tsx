import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, DollarSign, TrendingUp, BookOpen, MessageSquare } from "lucide-react";

interface UserDetail {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  ndc_balance: number;
  created_at: string;
}

interface Transaction {
  id: string;
  amount: number;
  title: string;
  type: string;
  created_at: string;
}

interface Stake {
  id: string;
  project_id: string;
  amount: number;
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  body: string;
  status: string;
  likes: number;
  created_at: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  created_at: string;
}

const AdminUserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stakes, setStakes] = useState<Stake[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      // Fetch user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (profileData) {
        setUser(profileData);

        // Fetch user's transactions
        const { data: transactionData } = await supabase
          .from("ndc_transactions")
          .select("*")
          .eq("user_id", profileData.user_id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (transactionData) setTransactions(transactionData);

        // Fetch user's stakes
        const { data: stakeData } = await supabase
          .from("staked_projects")
          .select("*")
          .eq("user_id", profileData.user_id)
          .order("created_at", { ascending: false });

        if (stakeData) setStakes(stakeData);

        // Fetch user's posts
        const { data: postData } = await supabase
          .from("community_posts")
          .select("id, title, body, status, likes, created_at")
          .eq("user_id", profileData.user_id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (postData) setPosts(postData);

        // Fetch user's enrollments
        const { data: enrollmentData } = await supabase
          .from("enrolled_courses")
          .select("*")
          .eq("user_id", profileData.user_id)
          .order("created_at", { ascending: false });

        if (enrollmentData) setEnrollments(enrollmentData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-5xl">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-20" />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="max-w-5xl text-center mt-20">
          <p className="text-muted-foreground">User not found</p>
          <Link to="/admin/users">
            <Button variant="outline" className="mt-4">Back to Users</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0);
  const totalEarnings = transactions
    .filter(t => t.type === 'reward' || t.type === 'mining')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/admin/users">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">
              {user.full_name || "Unnamed User"}
            </h1>
            <p className="text-[12px] text-muted-foreground font-medium mt-1">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* User Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Info */}
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[15px] font-display font-extrabold flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-[16px] font-bold shadow-premium">
                  {(user.full_name || "U").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-foreground">{user.full_name || "Unnamed"}</p>
                  <p className="text-[12px] text-muted-foreground">{user.phone || "No phone"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium mb-1">NDC Balance</p>
                  <p className="text-[18px] font-display font-extrabold text-metric">
                    {user.ndc_balance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium mb-1">Total Staked</p>
                  <p className="text-[18px] font-display font-extrabold text-metric">
                    {totalStaked.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[15px] font-display font-extrabold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <DollarSign className="h-6 w-6 text-primary mx-auto mb-1" />
                  <p className="text-[16px] font-bold text-metric">{transactions.length}</p>
                  <p className="text-[10px] text-muted-foreground">Transactions</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <TrendingUp className="h-6 w-6 text-accent mx-auto mb-1" />
                  <p className="text-[16px] font-bold text-metric">{stakes.length}</p>
                  <p className="text-[10px] text-muted-foreground">Stakes</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <BookOpen className="h-6 w-6 text-secondary mx-auto mb-1" />
                  <p className="text-[16px] font-bold text-metric">{enrollments.length}</p>
                  <p className="text-[10px] text-muted-foreground">Courses</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <MessageSquare className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-[16px] font-bold text-metric">{posts.length}</p>
                  <p className="text-[10px] text-muted-foreground">Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[15px] font-display font-extrabold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                      <div>
                        <p className="text-[12px] font-bold text-foreground">{transaction.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        className={`border-0 text-[10px] font-bold px-2 py-1 rounded-lg ${
                          transaction.type === 'reward' || transaction.type === 'mining' 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'bg-red-500/10 text-red-600'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} NDC
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground text-center py-4">No transactions</p>
              )}
            </CardContent>
          </Card>

          {/* Stakes */}
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[15px] font-display font-extrabold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Active Stakes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stakes.length > 0 ? (
                <div className="space-y-2">
                  {stakes.map((stake) => (
                    <div key={stake.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                      <div>
                        <p className="text-[12px] font-bold text-foreground">{stake.project_id}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(stake.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="gradient-accent text-accent-foreground border-0 text-[10px] font-bold px-2 py-1 rounded-lg">
                        {stake.amount.toLocaleString()} NDC
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground text-center py-4">No active stakes</p>
              )}
            </CardContent>
          </Card>

          {/* Community Posts */}
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[15px] font-display font-extrabold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Community Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {posts.length > 0 ? (
                <div className="space-y-2">
                  {posts.map((post) => (
                    <div key={post.id} className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] font-bold text-foreground truncate">{post.title}</p>
                        <Badge 
                          className={`border-0 text-[9px] font-bold px-2 py-0.5 rounded-lg ${
                            post.status === 'approved' 
                              ? 'bg-green-500/10 text-green-600'
                              : post.status === 'rejected'
                              ? 'bg-red-500/10 text-red-600'
                              : 'bg-yellow-500/10 text-yellow-600'
                          }`}
                        >
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-1 truncate">{post.body}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{post.likes} likes</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground text-center py-4">No posts</p>
              )}
            </CardContent>
          </Card>

          {/* Course Enrollments */}
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[15px] font-display font-extrabold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments.length > 0 ? (
                <div className="space-y-2">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                      <div>
                        <p className="text-[12px] font-bold text-foreground">{enrollment.course_id}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Enrolled: {new Date(enrollment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-600 border-0 text-[10px] font-bold px-2 py-1 rounded-lg">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground text-center py-4">No course enrollments</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetailPage;