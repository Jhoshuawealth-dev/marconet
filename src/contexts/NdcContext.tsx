import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Transaction {
  id: string;
  title: string;
  desc: string;
  amount: number;
  type: "earn" | "spend";
  date: string;
}

interface NdcContextType {
  balance: number;
  transactions: Transaction[];
  earn: (amount: number, title: string, desc: string) => void;
  spend: (amount: number, title: string, desc: string) => boolean;
  enrolledCourses: string[];
  enrollCourse: (courseId: string) => boolean;
  // Community
  dailyLikes: number;
  dailyComments: number;
  dailyShares: number;
  dailyPosts: number;
  likesUsedToday: string[];
  commentsUsedToday: string[];
  sharesUsedToday: string[];
  likePost: (postId: string) => boolean;
  commentPost: (postId: string, comment: string) => boolean;
  sharePost: (postId: string) => boolean;
  communityPosts: CommunityPost[];
  createPost: (title: string, body: string) => boolean;
  approvePost: (postId: string) => void;
  // Mining
  isMining: boolean;
  miningSession: number;
  startMining: () => void;
  stopMining: () => void;
  // Staking
  stakedProjects: Record<string, number>;
  stakeProject: (projectId: string, amount: number) => boolean;
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
}

const NdcContext = createContext<NdcContextType | null>(null);

export const useNdc = () => {
  const ctx = useContext(NdcContext);
  if (!ctx) throw new Error("useNdc must be used within NdcProvider");
  return ctx;
};

export const NdcProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(7420);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [likesUsedToday, setLikesUsedToday] = useState<string[]>([]);
  const [commentsUsedToday, setCommentsUsedToday] = useState<string[]>([]);
  const [sharesUsedToday, setSharesToday] = useState<string[]>([]);
  const [dailyPosts, setDailyPosts] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [miningSession, setMiningSession] = useState(0);
  const [miningInterval, setMiningInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [stakedProjects, setStakedProjects] = useState<Record<string, number>>({});
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    { id: "c1", author: "Sarah K.", avatar: "SK", topic: "Digital Farming", title: "Best strategies for maximizing NDC yield this season?", body: "I've been experimenting with different staking intervals...", likes: 42, comments: [{ author: "James", text: "Great question!" }], shares: 5, time: "2h ago", status: "approved" },
    { id: "c2", author: "James O.", avatar: "JO", topic: "Investment", title: "ROI comparison: Cassava vs Maize projects", body: "Looking at the data from Q4, cassava projects had...", likes: 35, comments: [{ author: "Ada", text: "Interesting analysis" }], shares: 3, time: "4h ago", status: "approved" },
    { id: "c3", author: "Ada M.", avatar: "AM", topic: "Community", title: "New governance proposal: Community fund allocation", body: "Proposing we allocate 5% of yields to community...", likes: 67, comments: [{ author: "Sarah", text: "I support this!" }], shares: 8, time: "6h ago", status: "approved" },
  ]);

  const addTransaction = useCallback((amount: number, title: string, desc: string, type: "earn" | "spend") => {
    setTransactions(prev => [{
      id: Date.now().toString(),
      title, desc, amount, type,
      date: new Date().toLocaleString()
    }, ...prev]);
  }, []);

  const earn = useCallback((amount: number, title: string, desc: string) => {
    setBalance(b => b + amount);
    addTransaction(amount, title, desc, "earn");
  }, [addTransaction]);

  const spend = useCallback((amount: number, title: string, desc: string): boolean => {
    if (balance < amount) return false;
    setBalance(b => b - amount);
    addTransaction(amount, title, desc, "spend");
    return true;
  }, [balance, addTransaction]);

  const enrollCourse = useCallback((courseId: string): boolean => {
    if (enrolledCourses.includes(courseId)) return true;
    if (balance < 200) return false;
    setBalance(b => b - 200);
    setEnrolledCourses(prev => [...prev, courseId]);
    addTransaction(200, "Course Enrollment", `Enrolled in course`, "spend");
    return true;
  }, [balance, enrolledCourses, addTransaction]);

  const likePost = useCallback((postId: string): boolean => {
    if (likesUsedToday.length >= 2 && !likesUsedToday.includes(postId)) return false;
    if (likesUsedToday.includes(postId)) return false;
    setLikesUsedToday(prev => [...prev, postId]);
    setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    earn(5, "Like Reward", "Liked a community post");
    return true;
  }, [likesUsedToday, earn]);

  const commentPost = useCallback((postId: string, comment: string): boolean => {
    if (commentsUsedToday.length >= 2 && !commentsUsedToday.includes(postId)) return false;
    if (commentsUsedToday.includes(postId)) return false;
    setCommentsUsedToday(prev => [...prev, postId]);
    setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, { author: "You", text: comment }] } : p));
    earn(10, "Comment Reward", "Commented on a community post");
    return true;
  }, [commentsUsedToday, earn]);

  const sharePost = useCallback((postId: string): boolean => {
    if (sharesUsedToday.length >= 2 && !sharesUsedToday.includes(postId)) return false;
    if (sharesUsedToday.includes(postId)) return false;
    setSharesToday(prev => [...prev, postId]);
    setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, shares: p.shares + 1 } : p));
    earn(20, "Share Reward", "Shared a community post");
    return true;
  }, [sharesUsedToday, earn]);

  const createPost = useCallback((title: string, body: string): boolean => {
    if (dailyPosts >= 2) return false;
    const newPost: CommunityPost = {
      id: `user-${Date.now()}`,
      author: "You",
      avatar: "YO",
      topic: "Community",
      title, body,
      likes: 0, comments: [], shares: 0,
      time: "Just now",
      status: "pending"
    };
    setCommunityPosts(prev => [newPost, ...prev]);
    setDailyPosts(p => p + 1);
    return true;
  }, [dailyPosts]);

  const approvePost = useCallback((postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId && p.status === "pending") {
        earn(200, "Post Approved", "Your community post was approved");
        return { ...p, status: "approved" };
      }
      return p;
    }));
  }, [earn]);

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
    setBalance(b => b - amount);
    setStakedProjects(prev => ({ ...prev, [projectId]: (prev[projectId] || 0) + amount }));
    addTransaction(amount, "Stake Investment", `Staked in project`, "spend");
    return true;
  }, [balance, addTransaction]);

  return (
    <NdcContext.Provider value={{
      balance, transactions, earn, spend,
      enrolledCourses, enrollCourse,
      dailyLikes: likesUsedToday.length, dailyComments: commentsUsedToday.length,
      dailyShares: sharesUsedToday.length, dailyPosts,
      likesUsedToday, commentsUsedToday, sharesUsedToday,
      likePost, commentPost, sharePost,
      communityPosts, createPost, approvePost,
      isMining, miningSession, startMining, stopMining,
      stakedProjects, stakeProject,
    }}>
      {children}
    </NdcContext.Provider>
  );
};
