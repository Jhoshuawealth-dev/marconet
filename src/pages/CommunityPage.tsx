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
import PageTransition from "@/components/app/PageTransition";

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
    if (likesUsedToday.includes(postId)) { toast({ title: "Already liked" }); return; }
    if (likesUsedToday.length >= 2) { toast({ title: "Daily limit reached", variant: "destructive" }); return; }
    const ok = likePost(postId);
    if (ok) toast({ title: "+1 NDC! ❤️", description: "Liked a post." });
  };

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return;
    if (commentsUsedToday.includes(postId)) { toast({ title: "Already commented" }); return; }
    if (commentsUsedToday.length >= 2) { toast({ title: "Daily limit reached", variant: "destructive" }); return; }
    const ok = commentPost(postId, commentText);
    if (ok) { toast({ title: "+3 NDC! 💬" }); setCommentText(""); setShowCommentDialog(null); }
  };

  const handleShare = (postId: string) => {
    if (sharesUsedToday.includes(postId)) { toast({ title: "Already shared" }); return; }
    if (sharesUsedToday.length >= 2) { toast({ title: "Daily limit reached", variant: "destructive" }); return; }
    const ok = sharePost(postId);
    if (ok) toast({ title: "+5 NDC! 🔗" });
  };

  const handleCreatePost = () => {
    if (!postTitle.trim() || !postBody.trim()) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    if (postType === "text") {
      if (dailyPosts >= 2) { toast({ title: "Daily limit reached", variant: "destructive" }); return; }
      const ok = createPost(postTitle, postBody);
      if (ok) toast({ title: "Post Submitted! 📝", description: "Pending approval. +200 NDC when approved." });
    } else {
      if (!realFarmChecked) { toast({ title: "Confirmation required", variant: "destructive" }); return; }
      if (postType === "video" && weeklyVideoPosts >= 1) { toast({ title: "Weekly limit", variant: "destructive" }); return; }
      if (postType === "picture" && weeklyPicturePosts >= 2) { toast({ title: "Weekly limit", variant: "destructive" }); return; }
      const ok = createMediaPost(postType, postTitle, postBody);
      if (ok) { const r = postType === "picture" ? 7 : 10; toast({ title: `+${r} NDC! 📸` }); }
    }
    setPostTitle(""); setPostBody(""); setPostType("text"); setRealFarmChecked(false); setShowPostDialog(false);
  };

  const postTypeIcon = (t: string) => {
    if (t === "picture") return <Image className="h-3 w-3" />;
    if (t === "video") return <Video className="h-3 w-3" />;
    return <FileText className="h-3 w-3" />;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="app-container px-5 pt-6 space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-extrabold text-foreground">Community</h1>
            <span className="text-[11px] font-semibold text-primary text-metric">{balance.toLocaleString()} NDC</span>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-muted rounded-2xl p-1">
            {(["live", "community"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 text-[11px] font-bold py-2.5 rounded-xl transition-all ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {t === "live" ? "🔴 Live Fields" : "💬 Community"}
              </button>
            ))}
          </div>

          {/* Limits banner */}
          {tab === "community" && (
            <Card className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-3.5 space-y-1.5">
                <p className="text-[10px] font-bold text-foreground uppercase tracking-wider">Activity Limits</p>
                <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                  <span>❤️ {likesUsedToday.length}/2</span>
                  <span>💬 {commentsUsedToday.length}/2</span>
                  <span>🔗 {sharesUsedToday.length}/2</span>
                  <span>📝 {dailyPosts}/2</span>
                  <span>📸 {weeklyPicturePosts}/2</span>
                  <span>🎬 {weeklyVideoPosts}/1</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  <strong className="text-foreground">Earn:</strong> Like +1 · Comment +3 · Share +5 · Pic +7 · Video +10 NDC
                </p>
              </CardContent>
            </Card>
          )}

          {tab === "live" ? (
            <div className="space-y-4">
              {liveStreams.map((s) => (
                <Card key={s.id} className="border border-border/60 shadow-premium rounded-2xl overflow-hidden">
                  <div className="bg-primary/8 h-36 flex items-center justify-center relative">
                    <Play className="h-12 w-12 text-primary/30" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground flex items-center gap-1">
                      <Wifi className="h-2.5 w-2.5" /> LIVE
                    </span>
                    <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-foreground/70 text-background flex items-center gap-1">
                      <Eye className="h-2.5 w-2.5" /> {s.viewers}
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display font-bold text-[13px] text-foreground">{s.title}</h3>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" /> {s.host}
                      </span>
                      <Button size="sm" className="text-[10px] h-8 rounded-xl font-bold gradient-accent text-accent-foreground border-0">Watch Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {communityPosts.map((d) => (
                <Card key={d.id} className="border border-border/60 shadow-premium rounded-2xl">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center text-primary font-bold text-[10px]">{d.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-foreground">{d.author}</p>
                        <p className="text-[10px] text-muted-foreground">{d.time}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {d.status === "pending" && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" /> Pending
                          </span>
                        )}
                        {d.status === "approved" && d.author === "You" && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/8 text-primary flex items-center gap-1">
                            <CheckCircle className="h-2.5 w-2.5" /> Approved
                          </span>
                        )}
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/8 text-primary flex items-center gap-1">
                          {postTypeIcon(d.postType)} {d.topic}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-[13px] text-foreground">{d.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{d.body}</p>

                    {d.comments.length > 0 && (
                      <div className="bg-muted/50 rounded-xl p-2.5 space-y-1">
                        {d.comments.slice(-2).map((c, i) => (
                          <p key={i} className="text-[10px] text-muted-foreground">
                            <strong className="text-foreground">{c.author}:</strong> {c.text}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-5 text-[10px] text-muted-foreground">
                      <button onClick={() => handleLike(d.id)}
                        className={`flex items-center gap-1 transition-colors ${likesUsedToday.includes(d.id) ? "text-primary" : "hover:text-primary"}`}>
                        <Heart className={`h-3.5 w-3.5 ${likesUsedToday.includes(d.id) ? "fill-current" : ""}`} /> {d.likes}
                      </button>
                      <button onClick={() => setShowCommentDialog(d.id)}
                        className={`flex items-center gap-1 transition-colors ${commentsUsedToday.includes(d.id) ? "text-primary" : "hover:text-primary"}`}>
                        <MessageCircle className="h-3.5 w-3.5" /> {d.comments.length}
                      </button>
                      <button onClick={() => handleShare(d.id)}
                        className={`flex items-center gap-1 transition-colors ${sharesUsedToday.includes(d.id) ? "text-primary" : "hover:text-primary"}`}>
                        <Share2 className="h-3.5 w-3.5" /> {d.shares}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* FAB */}
          <button onClick={() => setShowPostDialog(true)}
            className="fixed bottom-24 right-5 w-14 h-14 rounded-2xl gradient-primary text-primary-foreground shadow-elevated flex items-center justify-center z-40 transition-transform active:scale-90">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Comment Dialog */}
        <Dialog open={!!showCommentDialog} onOpenChange={() => setShowCommentDialog(null)}>
          <DialogContent className="max-w-sm rounded-3xl">
            <DialogHeader><DialogTitle className="text-[13px] font-display font-bold">Add Comment (+3 NDC)</DialogTitle></DialogHeader>
            <Input placeholder="Write your comment..." value={commentText} onChange={e => setCommentText(e.target.value)} className="rounded-2xl h-11 bg-muted/50 border-border/60" />
            <Button onClick={() => showCommentDialog && handleComment(showCommentDialog)} className="w-full rounded-2xl font-bold gap-1.5 gradient-primary border-0 h-11">
              <Send className="h-4 w-4" /> Post Comment
            </Button>
          </DialogContent>
        </Dialog>

        {/* Create Post Dialog */}
        <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
          <DialogContent className="max-w-sm rounded-3xl">
            <DialogHeader><DialogTitle className="text-[13px] font-display font-bold">Create Post</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="flex gap-2">
                {([
                  { type: "text" as const, icon: FileText, label: "Text" },
                  { type: "picture" as const, icon: Image, label: "Picture" },
                  { type: "video" as const, icon: Video, label: "Video" },
                ]).map((pt) => (
                  <button key={pt.type} onClick={() => setPostType(pt.type)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${postType === pt.type ? "gradient-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border/60"}`}>
                    <pt.icon className="h-3.5 w-3.5" /> {pt.label}
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-muted-foreground bg-muted/50 rounded-xl p-2.5">
                {postType === "text" && <span>📝 {dailyPosts}/2 today · Earn 200 NDC on approval</span>}
                {postType === "picture" && <span>📸 {weeklyPicturePosts}/2 this week · +7 NDC + 200 NDC on approval</span>}
                {postType === "video" && <span>🎬 {weeklyVideoPosts}/1 this week · +10 NDC + 200 NDC on approval</span>}
              </div>

              <Input placeholder="Post title" value={postTitle} onChange={e => setPostTitle(e.target.value)} className="rounded-2xl h-11 bg-muted/50 border-border/60" />
              <Textarea placeholder="What's on your mind?" value={postBody} onChange={e => setPostBody(e.target.value)} className="rounded-2xl min-h-[100px] bg-muted/50 border-border/60" />

              {(postType === "picture" || postType === "video") && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/5 border border-destructive/15">
                  <Checkbox id="real-farm" checked={realFarmChecked} onCheckedChange={(c) => setRealFarmChecked(c === true)} className="mt-0.5" />
                  <Label htmlFor="real-farm" className="text-[11px] text-foreground leading-tight cursor-pointer">
                    I confirm this is <strong>real farm content</strong>. AI-generated content will result in account suspension.
                  </Label>
                </div>
              )}

              <Button onClick={handleCreatePost} className="w-full rounded-2xl font-bold gradient-primary border-0 h-11">Submit Post</Button>
            </div>
          </DialogContent>
        </Dialog>

        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default CommunityPage;
