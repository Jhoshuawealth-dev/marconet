import { useState } from "react";
import { Heart, MessageCircle, Share2, Plus, Play, Eye, Users, Wifi, Send, CheckCircle, Clock, Image, Video, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import BottomNav from "@/components/app/BottomNav";
import { useNdc } from "@/contexts/NdcContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const liveStreams = [
  { id: 1, title: "Green Valley Soy — Live Harvest", viewers: 234, host: "FarmMaster", status: "LIVE" },
  { id: 2, title: "Maize Growth Update — Day 45", viewers: 89, host: "AgriTech Pro", status: "LIVE" },
];

const CommunityPage = () => {
  const [tab, setTab] = useState<"live" | "community">("community");
  const [showCommentDialog, setShowCommentDialog] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postType, setPostType] = useState<"text" | "picture" | "video">("text");
  const [realFarmChecked, setRealFarmChecked] = useState(false);

  const {
    communityPosts, likePost, commentPost, sharePost, createPost, createMediaPost,
    likesUsedToday, commentsUsedToday, sharesUsedToday, dailyPosts, balance,
    weeklyVideoPosts, weeklyPicturePosts
  } = useNdc();
  const { toast } = useToast();

  const handleLike = (postId: string) => {
    if (likesUsedToday.includes(postId)) {
      toast({ title: "Already liked", description: "You've already liked this post." });
      return;
    }
    if (likesUsedToday.length >= 2) {
      toast({ title: "Daily limit reached", description: "You can only like 2 posts per day.", variant: "destructive" });
      return;
    }
    const ok = likePost(postId);
    if (ok) toast({ title: "+1 NDC! ❤️", description: "You earned 1 NDC for liking a post." });
  };

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return;
    if (commentsUsedToday.includes(postId)) {
      toast({ title: "Already commented", description: "You've already commented on this post." });
      return;
    }
    if (commentsUsedToday.length >= 2) {
      toast({ title: "Daily limit reached", description: "You can only comment on 2 posts per day.", variant: "destructive" });
      return;
    }
    const ok = commentPost(postId, commentText);
    if (ok) {
      toast({ title: "+3 NDC! 💬", description: "You earned 3 NDC for commenting." });
      setCommentText("");
      setShowCommentDialog(null);
    }
  };

  const handleShare = (postId: string) => {
    if (sharesUsedToday.includes(postId)) {
      toast({ title: "Already shared", description: "You've already shared this post." });
      return;
    }
    if (sharesUsedToday.length >= 2) {
      toast({ title: "Daily limit reached", description: "You can only share 2 posts per day.", variant: "destructive" });
      return;
    }
    const ok = sharePost(postId);
    if (ok) toast({ title: "+5 NDC! 🔗", description: "You earned 5 NDC for sharing a post." });
  };

  const handleCreatePost = () => {
    if (!postTitle.trim() || !postBody.trim()) {
      toast({ title: "Missing fields", description: "Please fill in title and content.", variant: "destructive" });
      return;
    }

    if (postType === "text") {
      if (dailyPosts >= 2) {
        toast({ title: "Daily limit reached", description: "You can only create 2 text posts per day.", variant: "destructive" });
        return;
      }
      const ok = createPost(postTitle, postBody);
      if (ok) {
        toast({ title: "Post Submitted! 📝", description: "Your post is pending approval. You'll earn 200 NDC when approved." });
      }
    } else {
      if (!realFarmChecked) {
        toast({ title: "Confirmation required", description: "You must confirm this is real farm content (not AI-generated).", variant: "destructive" });
        return;
      }
      if (postType === "video" && weeklyVideoPosts >= 1) {
        toast({ title: "Weekly limit reached", description: "You can only post 1 video per week.", variant: "destructive" });
        return;
      }
      if (postType === "picture" && weeklyPicturePosts >= 2) {
        toast({ title: "Weekly limit reached", description: "You can only post 2 pictures per week.", variant: "destructive" });
        return;
      }
      const ok = createMediaPost(postType, postTitle, postBody);
      if (ok) {
        const reward = postType === "picture" ? 7 : 10;
        toast({ title: `+${reward} NDC! 📸`, description: `${postType === "picture" ? "Picture" : "Video"} uploaded! Pending approval for +200 NDC bonus.` });
      }
    }

    setPostTitle("");
    setPostBody("");
    setPostType("text");
    setRealFarmChecked(false);
    setShowPostDialog(false);
  };

  const postTypeIcon = (t: string) => {
    if (t === "picture") return <Image className="h-3 w-3" />;
    if (t === "video") return <Video className="h-3 w-3" />;
    return <FileText className="h-3 w-3" />;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-foreground">Community</h1>
          <span className="text-xs font-semibold text-primary">{balance.toLocaleString()} NDC</span>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-muted rounded-xl p-1">
          {(["live", "community"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "live" ? "🔴 Live Fields" : "💬 Community"}
            </button>
          ))}
        </div>

        {/* Limits banner */}
        {tab === "community" && (
          <Card className="border shadow-sm">
            <CardContent className="p-3 space-y-1">
              <p className="text-[10px] font-bold text-foreground mb-1">Daily & Weekly Limits</p>
              <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                <span>❤️ {likesUsedToday.length}/2 likes</span>
                <span>💬 {commentsUsedToday.length}/2 comments</span>
                <span>🔗 {sharesUsedToday.length}/2 shares</span>
              </div>
              <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                <span>📝 {dailyPosts}/2 text posts</span>
                <span>📸 {weeklyPicturePosts}/2 pics/week</span>
                <span>🎬 {weeklyVideoPosts}/1 video/week</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                <strong>Rewards:</strong> Like +1 · Comment +3 · Share +5 · Pic +7 · Video +10 NDC
              </div>
            </CardContent>
          </Card>
        )}

        {tab === "live" ? (
          <div className="space-y-4">
            {liveStreams.map((s) => (
              <Card key={s.id} className="border shadow-sm overflow-hidden">
                <div className="bg-primary/10 h-36 flex items-center justify-center relative">
                  <Play className="h-12 w-12 text-primary/40" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground flex items-center gap-1">
                    <Wifi className="h-2.5 w-2.5" /> LIVE
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-foreground/70 text-background flex items-center gap-1">
                    <Eye className="h-2.5 w-2.5" /> {s.viewers}
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-sm text-foreground">{s.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> {s.host}
                    </span>
                    <Button size="sm" className="text-[10px] h-7 rounded-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90">Watch Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {communityPosts.map((d) => (
              <Card key={d.id} className="border shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-[10px]">{d.avatar}</div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{d.author}</p>
                      <p className="text-[10px] text-muted-foreground">{d.time}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      {d.status === "pending" && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" /> Pending
                        </span>
                      )}
                      {d.status === "approved" && d.author === "You" && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                          <CheckCircle className="h-2.5 w-2.5" /> Approved
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                        {postTypeIcon(d.postType)} {d.topic}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{d.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{d.body}</p>

                  {d.comments.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-2 space-y-1">
                      {d.comments.slice(-2).map((c, i) => (
                        <p key={i} className="text-[10px] text-muted-foreground">
                          <strong className="text-foreground">{c.author}:</strong> {c.text}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <button onClick={() => handleLike(d.id)}
                      className={`flex items-center gap-1 hover:text-primary transition-colors ${likesUsedToday.includes(d.id) ? "text-primary" : ""}`}>
                      <Heart className={`h-3 w-3 ${likesUsedToday.includes(d.id) ? "fill-current" : ""}`} /> {d.likes}
                    </button>
                    <button onClick={() => setShowCommentDialog(d.id)}
                      className={`flex items-center gap-1 hover:text-primary transition-colors ${commentsUsedToday.includes(d.id) ? "text-primary" : ""}`}>
                      <MessageCircle className="h-3 w-3" /> {d.comments.length}
                    </button>
                    <button onClick={() => handleShare(d.id)}
                      className={`flex items-center gap-1 hover:text-primary transition-colors ${sharesUsedToday.includes(d.id) ? "text-primary" : ""}`}>
                      <Share2 className="h-3 w-3" /> {d.shares}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* FAB */}
        <button onClick={() => setShowPostDialog(true)}
          className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-40">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Comment Dialog */}
      <Dialog open={!!showCommentDialog} onOpenChange={() => setShowCommentDialog(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader><DialogTitle className="text-sm font-bold">Add Comment (+3 NDC)</DialogTitle></DialogHeader>
          <Input placeholder="Write your comment..." value={commentText} onChange={e => setCommentText(e.target.value)} className="rounded-xl" />
          <Button onClick={() => showCommentDialog && handleComment(showCommentDialog)} className="w-full rounded-xl font-bold gap-1">
            <Send className="h-4 w-4" /> Post Comment
          </Button>
        </DialogContent>
      </Dialog>

      {/* Create Post Dialog */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader><DialogTitle className="text-sm font-bold">Create Post</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {/* Post type selector */}
            <div className="flex gap-2">
              {([
                { type: "text" as const, icon: FileText, label: "Text" },
                { type: "picture" as const, icon: Image, label: "Picture" },
                { type: "video" as const, icon: Video, label: "Video" },
              ]).map((pt) => (
                <button key={pt.type} onClick={() => setPostType(pt.type)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors border ${postType === pt.type ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"}`}>
                  <pt.icon className="h-3.5 w-3.5" /> {pt.label}
                </button>
              ))}
            </div>

            {/* Limits info */}
            <div className="text-[10px] text-muted-foreground bg-muted rounded-lg p-2">
              {postType === "text" && <span>📝 {dailyPosts}/2 text posts today · Earn 200 NDC on approval</span>}
              {postType === "picture" && <span>📸 {weeklyPicturePosts}/2 pictures this week · Earn 7 NDC + 200 NDC on approval</span>}
              {postType === "video" && <span>🎬 {weeklyVideoPosts}/1 video this week · Earn 10 NDC + 200 NDC on approval</span>}
            </div>

            <Input placeholder="Post title" value={postTitle} onChange={e => setPostTitle(e.target.value)} className="rounded-xl" />
            <Textarea placeholder="What's on your mind?" value={postBody} onChange={e => setPostBody(e.target.value)} className="rounded-xl min-h-[100px]" />

            {/* Real Farm checkbox for media posts */}
            {(postType === "picture" || postType === "video") && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
                <Checkbox id="real-farm" checked={realFarmChecked} onCheckedChange={(c) => setRealFarmChecked(c === true)} className="mt-0.5" />
                <Label htmlFor="real-farm" className="text-[11px] text-foreground leading-tight cursor-pointer">
                  I confirm this is <strong>real farm content</strong> captured from an actual farm. AI-generated or fake farm content is strictly prohibited and will result in account suspension.
                </Label>
              </div>
            )}

            <Button onClick={handleCreatePost} className="w-full rounded-xl font-bold">Submit Post</Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default CommunityPage;
