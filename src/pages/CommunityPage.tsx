import { useState } from "react";
import { Heart, MessageCircle, Share2, Plus, Play, Eye, Users, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";

const liveStreams = [
  { id: 1, title: "Green Valley Soy — Live Harvest", viewers: 234, host: "FarmMaster", status: "LIVE" },
  { id: 2, title: "Maize Growth Update — Day 45", viewers: 89, host: "AgriTech Pro", status: "LIVE" },
];

const discussions = [
  { id: 1, author: "Sarah K.", avatar: "SK", topic: "Digital Farming", title: "Best strategies for maximizing NDC yield this season?", body: "I've been experimenting with different staking intervals...", likes: 42, comments: 18, time: "2h ago" },
  { id: 2, author: "James O.", avatar: "JO", topic: "Investment", title: "ROI comparison: Cassava vs Maize projects", body: "Looking at the data from Q4, cassava projects had...", likes: 35, comments: 24, time: "4h ago" },
  { id: 3, author: "Ada M.", avatar: "AM", topic: "Community", title: "New governance proposal: Community fund allocation", body: "Proposing we allocate 5% of yields to community...", likes: 67, comments: 31, time: "6h ago" },
];

const CommunityPage = () => {
  const [tab, setTab] = useState<"live" | "community">("community");

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
        <h1 className="text-xl font-extrabold text-foreground">Community</h1>

        {/* Tab toggle */}
        <div className="flex bg-muted rounded-xl p-1">
          {(["live", "community"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t === "live" ? "🔴 Live Fields" : "💬 Community"}
            </button>
          ))}
        </div>

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
                    <Button size="sm" className="text-[10px] h-7 rounded-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90">
                      Watch Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Topic filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["All", "Digital Farming", "Investment", "Community", "Governance"].map((t, i) => (
                <button
                  key={t}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Discussion cards */}
            {discussions.map((d) => (
              <Card key={d.id} className="border shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-[10px]">
                      {d.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{d.author}</p>
                      <p className="text-[10px] text-muted-foreground">{d.time}</p>
                    </div>
                    <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{d.topic}</span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{d.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{d.body}</p>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary"><Heart className="h-3 w-3" /> {d.likes}</button>
                    <button className="flex items-center gap-1 hover:text-primary"><MessageCircle className="h-3 w-3" /> {d.comments}</button>
                    <button className="flex items-center gap-1 hover:text-primary"><Share2 className="h-3 w-3" /> Share</button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* FAB */}
        <button className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-40">
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default CommunityPage;
