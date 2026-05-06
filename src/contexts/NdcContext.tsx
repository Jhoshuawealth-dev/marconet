import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Exchange rates
export const NDC_RATES = {
  GBP: 5,
  USD: 7,
  NGN: 11500,
};

interface Transaction {
  id: string;
  title: string;
  desc: string;
  amount: number;
  type: "earn" | "spend";
  date: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  body: string;
  likes: number;
  comments: { author: string; text: string }[];
  shares: number;
  time: string;
  status: "pending" | "approved";
  topic: string;
  postType: "text" | "picture" | "video";
}

export interface StakeRecord {
  id: string;
  project_id: string;
  project_name: string | null;
  amount: number;
  roi_percent: number;
  status: string;
  matured_at: string | null;
  created_at: string;
}

interface NdcContextType {
  balance: number;
  transactions: Transaction[];
  earn: (amount: number, title: string, desc: string) => void;
  spend: (amount: number, title: string, desc: string) => boolean;
  enrolledCourses: string[];
  enrollCourse: (courseId: string) => boolean;
  dailyLikes: number;
  dailyComments: number;
  dailyShares: number;
  dailyPosts: number;
  weeklyVideoPosts: number;
  weeklyPicturePosts: number;
  monthlyHarvests: number;
  likesUsedToday: string[];
  commentsUsedToday: string[];
  sharesUsedToday: string[];
  likePost: (postId: string) => boolean;
  commentPost: (postId: string, comment: string) => boolean;
  sharePost: (postId: string) => boolean;
  communityPosts: CommunityPost[];
  createPost: (title: string, body: string) => boolean;
  createMediaPost: (type: "picture" | "video", title: string, body: string) => boolean;
  approvePost: (postId: string) => void;
  harvestAction: () => boolean;
  isMining: boolean;
  miningSession: number;
  startMining: () => void;
  stopMining: () => void;
  stakedProjects: Record<string, number>;
  stakeRecords: StakeRecord[];
  stakeProject: (projectId: string, amount: number, opts?: { projectName?: string; roiPercent?: number; durationMonths?: number }) => boolean;
  claimStake: (stakeId: string) => Promise<{ ok: boolean; error?: string; payout?: number }>;
  refreshStakes: () => Promise<void>;
  loading: boolean;
}

const NdcContext = createContext<NdcContextType | null>(null);

export const useNdc = () => {
  const ctx = useContext(NdcContext);
  if (!ctx) throw new Error("useNdc must be used within NdcProvider");
  return ctx;
};

export const NdcProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [likesUsedToday, setLikesUsedToday] = useState<string[]>([]);
  const [commentsUsedToday, setCommentsUsedToday] = useState<string[]>([]);
  const [sharesUsedToday, setSharesToday] = useState<string[]>([]);
  const [dailyPosts, setDailyPosts] = useState(0);
  const [weeklyVideoPosts, setWeeklyVideoPosts] = useState(0);
  const [weeklyPicturePosts, setWeeklyPicturePosts] = useState(0);
  const [monthlyHarvests, setMonthlyHarvests] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [miningSession, setMiningSession] = useState(0);
  const [miningInterval, setMiningInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [stakedProjects, setStakedProjects] = useState<Record<string, number>>({});
  const [stakeRecords, setStakeRecords] = useState<StakeRecord[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── Load all state from DB on auth ───
  useEffect(() => {
    if (!userId) {
      setBalance(0);
      setTransactions([]);
      setEnrolledCourses([]);
      setStakedProjects({});
      setCommunityPosts([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        // Profile (balance)
        const { data: profile } = await supabase
          .from("profiles")
          .select("ndc_balance")
          .eq("user_id", userId)
          .single();
        if (profile) setBalance(profile.ndc_balance);

        // Transactions
        const { data: txns } = await supabase
          .from("ndc_transactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(100);
        if (txns) {
          setTransactions(txns.map(t => ({
            id: t.id,
            title: t.title,
            desc: t.description || "",
            amount: t.amount,
            type: t.type as "earn" | "spend",
            date: new Date(t.created_at).toLocaleString(),
          })));
        }

        // Enrolled courses
        const { data: courses } = await supabase
          .from("enrolled_courses")
          .select("course_id")
          .eq("user_id", userId);
        if (courses) setEnrolledCourses(courses.map(c => c.course_id));

        // Staked projects
        const { data: stakes } = await supabase
          .from("staked_projects")
          .select("*")
          .eq("user_id", userId);
        if (stakes) {
          const map: Record<string, number> = {};
          stakes.forEach((s: any) => {
            if (s.status === "active") {
              map[s.project_id] = (map[s.project_id] || 0) + s.amount;
            }
          });
          setStakedProjects(map);
          setStakeRecords(stakes as any);
        }

        // Community posts (all visible)
        const { data: posts } = await supabase
          .from("community_posts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);
        if (posts) {
          // Load comments for each post
          const postIds = posts.map(p => p.id);
          const { data: comments } = await supabase
            .from("community_comments")
            .select("*")
            .in("post_id", postIds.length > 0 ? postIds : ["__none__"])
            .order("created_at", { ascending: true });

          const commentsByPost: Record<string, { author: string; text: string }[]> = {};
          comments?.forEach(c => {
            if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
            commentsByPost[c.post_id].push({ author: c.author_name, text: c.content });
          });

          setCommunityPosts(posts.map(p => ({
            id: p.id,
            author: p.author_name,
            avatar: p.author_avatar,
            title: p.title,
            body: p.body,
            likes: p.likes,
            comments: commentsByPost[p.id] || [],
            shares: p.shares,
            time: getTimeAgo(p.created_at),
            status: p.status as "pending" | "approved",
            topic: p.topic,
            postType: p.post_type as "text" | "picture" | "video",
          })));
        }
      } catch (err) {
        console.error("Failed to load NDC state:", err);
      }
      setLoading(false);
    };

    load();
  }, [userId]);

  // ─── DB helpers ───
  const updateBalance = useCallback(async (newBalance: number) => {
    if (!userId) return;
    await supabase.from("profiles").update({ ndc_balance: newBalance }).eq("user_id", userId);
  }, [userId]);

  const insertTransaction = useCallback(async (amount: number, title: string, desc: string, type: "earn" | "spend") => {
    if (!userId) return;
    await supabase.from("ndc_transactions").insert({
      user_id: userId, title, description: desc, amount, type,
    });
  }, [userId]);

  // ─── Actions ───
  const earn = useCallback((amount: number, title: string, desc: string) => {
    setBalance(b => {
      const nb = b + amount;
      updateBalance(nb);
      return nb;
    });
    const tx: Transaction = {
      id: Date.now().toString(), title, desc, amount, type: "earn",
      date: new Date().toLocaleString(),
    };
    setTransactions(prev => [tx, ...prev]);
    insertTransaction(amount, title, desc, "earn");
  }, [updateBalance, insertTransaction]);

  const spend = useCallback((amount: number, title: string, desc: string): boolean => {
    if (balance < amount) return false;
    setBalance(b => {
      const nb = b - amount;
      updateBalance(nb);
      return nb;
    });
    const tx: Transaction = {
      id: Date.now().toString(), title, desc, amount, type: "spend",
      date: new Date().toLocaleString(),
    };
    setTransactions(prev => [tx, ...prev]);
    insertTransaction(amount, title, desc, "spend");
    return true;
  }, [balance, updateBalance, insertTransaction]);

  const enrollCourse = useCallback((courseId: string): boolean => {
    if (enrolledCourses.includes(courseId)) return true;
    if (balance < 200) return false;
    setBalance(b => {
      const nb = b - 200;
      updateBalance(nb);
      return nb;
    });
    setEnrolledCourses(prev => [...prev, courseId]);
    insertTransaction(200, "Course Enrollment", "Enrolled in course", "spend");
    if (userId) {
      supabase.from("enrolled_courses").insert({ user_id: userId, course_id: courseId });
    }
    return true;
  }, [balance, enrolledCourses, userId, updateBalance, insertTransaction]);

  const likePost = useCallback((postId: string): boolean => {
    if (likesUsedToday.length >= 2 && !likesUsedToday.includes(postId)) return false;
    if (likesUsedToday.includes(postId)) return false;
    setLikesUsedToday(prev => [...prev, postId]);
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        if (userId) supabase.from("community_posts").update({ likes: p.likes + 1 }).eq("id", postId);
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
    earn(1, "Like Reward", "Liked a community post");
    return true;
  }, [likesUsedToday, earn, userId]);

  const commentPost = useCallback((postId: string, comment: string): boolean => {
    if (commentsUsedToday.length >= 2 && !commentsUsedToday.includes(postId)) return false;
    if (commentsUsedToday.includes(postId)) return false;
    setCommentsUsedToday(prev => [...prev, postId]);
    const authorName = "You";
    setCommunityPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, comments: [...p.comments, { author: authorName, text: comment }] } : p
    ));
    if (userId) {
      supabase.from("community_comments").insert({
        post_id: postId, user_id: userId, author_name: authorName, content: comment,
      });
    }
    earn(3, "Comment Reward", "Commented on a community post");
    return true;
  }, [commentsUsedToday, earn, userId]);

  const sharePost = useCallback((postId: string): boolean => {
    if (sharesUsedToday.length >= 2 && !sharesUsedToday.includes(postId)) return false;
    if (sharesUsedToday.includes(postId)) return false;
    setSharesToday(prev => [...prev, postId]);
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        if (userId) supabase.from("community_posts").update({ shares: p.shares + 1 }).eq("id", postId);
        return { ...p, shares: p.shares + 1 };
      }
      return p;
    }));
    earn(5, "Share Reward", "Shared a community post");
    return true;
  }, [sharesUsedToday, earn, userId]);

  const createPost = useCallback((title: string, body: string): boolean => {
    if (dailyPosts >= 2) return false;
    const authorName = "You";
    const newPost: CommunityPost = {
      id: `user-${Date.now()}`, author: authorName, avatar: "YO", topic: "Community",
      title, body, likes: 0, comments: [], shares: 0,
      time: "Just now", status: "pending", postType: "text",
    };
    setCommunityPosts(prev => [newPost, ...prev]);
    setDailyPosts(p => p + 1);
    if (userId) {
      supabase.from("community_posts").insert({
        user_id: userId, author_name: authorName, title, body,
        topic: "Community", post_type: "text", status: "pending",
      }).select("id").then(({ data }) => {
        if (data && data.length > 0) {
          setCommunityPosts(prev => prev.map(p =>
            p.id === newPost.id ? { ...p, id: data[0].id } : p
          ));
        }
      });
    }
    return true;
  }, [dailyPosts, userId]);

  const createMediaPost = useCallback((type: "picture" | "video", title: string, body: string): boolean => {
    if (type === "video" && weeklyVideoPosts >= 1) return false;
    if (type === "picture" && weeklyPicturePosts >= 2) return false;
    const reward = type === "picture" ? 7 : 10;
    const authorName = "You";
    const newPost: CommunityPost = {
      id: `user-${Date.now()}`, author: authorName, avatar: "YO", topic: "Farm Content",
      title, body, likes: 0, comments: [], shares: 0,
      time: "Just now", status: "pending", postType: type,
    };
    setCommunityPosts(prev => [newPost, ...prev]);
    if (type === "video") setWeeklyVideoPosts(p => p + 1);
    else setWeeklyPicturePosts(p => p + 1);
    earn(reward, `${type === "picture" ? "Picture" : "Video"} Upload Reward`, `Uploaded a ${type} post (+${reward} NDC)`);
    if (userId) {
      supabase.from("community_posts").insert({
        user_id: userId, author_name: authorName, title, body,
        topic: "Farm Content", post_type: type, status: "pending",
      });
    }
    return true;
  }, [weeklyVideoPosts, weeklyPicturePosts, earn, userId]);

  const approvePost = useCallback((postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId && p.status === "pending") {
        if (userId) supabase.from("community_posts").update({ status: "approved" }).eq("id", postId);
        earn(200, "Post Approved", "Your community post was approved");
        return { ...p, status: "approved" };
      }
      return p;
    }));
  }, [earn, userId]);

  const harvestAction = useCallback((): boolean => {
    if (monthlyHarvests >= 4) return false;
    setMonthlyHarvests(p => p + 1);
    return true;
  }, [monthlyHarvests]);

  const startMining = useCallback(() => {
    if (isMining) return;
    setIsMining(true);
    setMiningSession(0);
    const interval = setInterval(() => {
      setMiningSession(prev => prev + 1);
    }, 3000);
    setMiningInterval(interval);
  }, [isMining]);

  const stopMining = useCallback(() => {
    if (!isMining) return;
    setIsMining(false);
    if (miningInterval) clearInterval(miningInterval);
    setMiningInterval(null);
    if (miningSession > 0) {
      earn(miningSession, "Mining Reward", `Mined ${miningSession} NDC this session`);
    }
  }, [isMining, miningInterval, miningSession, earn]);

  const stakeProject = useCallback((projectId: string, amount: number): boolean => {
    if (balance < amount) return false;
    setBalance(b => {
      const nb = b - amount;
      updateBalance(nb);
      return nb;
    });
    setStakedProjects(prev => {
      const newAmount = (prev[projectId] || 0) + amount;
      if (userId) {
        // Upsert stake
        supabase.from("staked_projects")
          .upsert({ user_id: userId, project_id: projectId, amount: newAmount }, { onConflict: "user_id,project_id" });
      }
      return { ...prev, [projectId]: newAmount };
    });
    insertTransaction(amount, "Stake Investment", `Staked in project`, "spend");
    return true;
  }, [balance, userId, updateBalance, insertTransaction]);

  return (
    <NdcContext.Provider value={{
      balance, transactions, earn, spend,
      enrolledCourses, enrollCourse,
      dailyLikes: likesUsedToday.length, dailyComments: commentsUsedToday.length,
      dailyShares: sharesUsedToday.length, dailyPosts,
      weeklyVideoPosts, weeklyPicturePosts, monthlyHarvests,
      likesUsedToday, commentsUsedToday, sharesUsedToday,
      likePost, commentPost, sharePost,
      communityPosts, createPost, createMediaPost, approvePost, harvestAction,
      isMining, miningSession, startMining, stopMining,
      stakedProjects, stakeProject,
      loading,
    }}>
      {children}
    </NdcContext.Provider>
  );
};

// Helper
function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
