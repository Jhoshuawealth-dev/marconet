import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
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

export interface CommunityComment {
  id: string;
  user_id: string;
  author: string;
  text: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  author: string;
  avatar: string;
  title: string;
  body: string;
  likes: number;
  comments: CommunityComment[];
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
  miningMultiplier: number;
  startMining: () => void;
  stopMining: () => void;
  activeUpgrades: ActiveUpgrade[];
  purchaseUpgrade: (upgrade: { id: string; label: string; cost: number; multiplier: number; durationHours: number }) => Promise<{ ok: boolean; error?: string }>;
  stakedProjects: Record<string, number>;
  stakeRecords: StakeRecord[];
  stakeProject: (projectId: string, amount: number, opts?: { projectName?: string; roiPercent?: number; durationMonths?: number }) => boolean;
  claimStake: (stakeId: string) => Promise<{ ok: boolean; error?: string; payout?: number }>;
  refreshStakes: () => Promise<void>;
  loading: boolean;
}

export interface ActiveUpgrade {
  id: string;
  upgrade_id: string;
  multiplier: number;
  expires_at: string;
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
  const [activeUpgrades, setActiveUpgrades] = useState<ActiveUpgrade[]>([]);
  const [loading, setLoading] = useState(true);

  const now = Date.now();
  const miningMultiplier = activeUpgrades.reduce(
    (m, u) => (new Date(u.expires_at).getTime() > now ? m * Number(u.multiplier) : m),
    1,
  );

  // Keep a ref to the latest upgrades so the running mining interval always sees fresh boosts
  const upgradesRef = useRef<ActiveUpgrade[]>([]);
  useEffect(() => { upgradesRef.current = activeUpgrades; }, [activeUpgrades]);


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
        // Active mining upgrades
        const { data: ups } = await supabase
          .from("user_upgrades" as any)
          .select("*")
          .eq("user_id", userId)
          .gt("expires_at", new Date().toISOString());
        if (ups) setActiveUpgrades(ups as any);
      } catch (err) {
        console.error("Failed to load NDC state:", err);
      }
      setLoading(false);
    };

    load();
  }, [userId]);

  // ─── DB helpers ───
  // Balance updates are performed atomically inside record_ndc_transaction (SECURITY DEFINER RPC).
  // This helper remains a no-op for backwards compatibility with optimistic UI callsites.
  const updateBalance = useCallback(async (_newBalance: number) => {
    // intentionally no-op — server is the source of truth
  }, []);

  const insertTransaction = useCallback(async (amount: number, title: string, desc: string, type: "earn" | "spend") => {
    if (!userId) return;
    const { data, error } = await supabase.rpc("record_ndc_transaction" as any, {
      _amount: amount, _title: title, _description: desc, _type: type,
    });
    if (error) {
      console.error("record_ndc_transaction failed:", error);
      return;
    }
    const result = data as any;
    if (result?.ok && typeof result.balance === "number") {
      setBalance(result.balance);
    }
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
    if (!userId) return false;
    // Server-side atomic enrollment: validates balance and prevents duplicates.
    supabase.rpc("enroll_course" as any, { _course_id: courseId }).then(({ data, error }) => {
      if (error) { console.error("enroll_course failed:", error); return; }
      const result = data as any;
      if (!result?.ok) { console.error("enroll_course:", result?.error); return; }
      if (typeof result.balance === "number") setBalance(result.balance);
      setEnrolledCourses(prev => prev.includes(courseId) ? prev : [...prev, courseId]);
    });
    return true;
  }, [balance, enrolledCourses, userId]);

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
      // Always read the latest upgrades via ref so newly-purchased boosts apply immediately
      const liveMult = upgradesRef.current.reduce(
        (m, u) => (new Date(u.expires_at).getTime() > Date.now() ? m * Number(u.multiplier) : m),
        1,
      );
      setMiningSession(prev => prev + Math.max(1, Math.round(liveMult)));
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

  const refreshUpgrades = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("user_upgrades" as any)
      .select("*")
      .eq("user_id", userId)
      .gt("expires_at", new Date().toISOString());
    if (data) setActiveUpgrades(data as any);
  }, [userId]);

  const purchaseUpgrade = useCallback(async (upgrade: { id: string; label: string; cost: number; multiplier: number; durationHours: number }) => {
    const { data, error } = await supabase.rpc("purchase_mining_upgrade" as any, {
      _upgrade_id: upgrade.id,
      _cost: upgrade.cost,
      _multiplier: upgrade.multiplier,
      _duration_hours: upgrade.durationHours,
      _label: upgrade.label,
    });
    if (error) return { ok: false, error: error.message };
    const result = data as any;
    if (!result?.ok) return { ok: false, error: result?.error || "Purchase failed" };
    if (typeof result.balance === "number") setBalance(result.balance);
    await refreshUpgrades();
    return { ok: true };
  }, [refreshUpgrades]);


  const refreshStakes = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from("staked_projects").select("*").eq("user_id", userId);
    if (data) {
      const map: Record<string, number> = {};
      data.forEach((s: any) => {
        if (s.status === "active") map[s.project_id] = (map[s.project_id] || 0) + s.amount;
      });
      setStakedProjects(map);
      setStakeRecords(data as any);
    }
  }, [userId]);

  const stakeProject = useCallback((projectId: string, amount: number, opts?: { projectName?: string; roiPercent?: number; durationMonths?: number }): boolean => {
    if (balance < amount) return false;
    if (!userId) return false;
    // Server-side atomic stake creation: validates balance, clamps ROI/duration.
    supabase.rpc("create_stake" as any, {
      _project_id: projectId,
      _amount: amount,
      _project_name: opts?.projectName ?? null,
      _roi_percent: opts?.roiPercent ?? 15,
      _duration_months: opts?.durationMonths ?? 6,
    }).then(({ data, error }) => {
      if (error) { console.error("create_stake failed:", error); return; }
      const result = data as any;
      if (!result?.ok) { console.error("create_stake:", result?.error); return; }
      if (typeof result.balance === "number") setBalance(result.balance);
      refreshStakes();
    });
    setStakedProjects(prev => ({ ...prev, [projectId]: (prev[projectId] || 0) + amount }));
    return true;
  }, [balance, userId, refreshStakes]);

  const claimStake = useCallback(async (stakeId: string) => {
    const { data, error } = await supabase.rpc("claim_matured_stake" as any, { _stake_id: stakeId });
    if (error) return { ok: false, error: error.message };
    const result = data as any;
    if (!result?.ok) return { ok: false, error: result?.error || "Failed to claim" };
    if (typeof result.balance === "number") setBalance(result.balance);
    await refreshStakes();
    return { ok: true, payout: result.payout };
  }, [refreshStakes]);

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
      isMining, miningSession, miningMultiplier, startMining, stopMining,
      activeUpgrades, purchaseUpgrade,
      stakedProjects, stakeRecords, stakeProject, claimStake, refreshStakes,
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
