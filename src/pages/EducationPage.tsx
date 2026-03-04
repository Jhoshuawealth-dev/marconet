import { useState } from "react";
import { Search, BookOpen, Award, Clock, ChevronRight, Play, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/app/BottomNav";
import { useNdc } from "@/contexts/NdcContext";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Digital Farming", "Investment", "Governance", "AI Tools"];

const currentCourse = {
  id: "current",
  title: "Digital Farming Fundamentals",
  modules: 12,
  completed: 7,
  progress: 58,
  category: "Digital Farming",
};

const recommended = [
  { id: "r1", title: "Smart Staking Strategies", desc: "Learn advanced techniques to maximize your NDC returns.", duration: "45 min", modules: 8, category: "Investment" },
  { id: "r2", title: "Supply Chain Mastery", desc: "Understand how farm yield flows from field to wallet.", duration: "1h 20m", modules: 10, category: "Digital Farming" },
  { id: "r3", title: "AI Farming Deep Dive", desc: "Unlock the full power of AI-driven farming tools.", duration: "2h", modules: 15, category: "AI Tools" },
  { id: "r4", title: "Governance Fundamentals", desc: "Learn how to participate in community governance.", duration: "30 min", modules: 6, category: "Governance" },
];

const certificates = [
  { id: "cert1", title: "Certified Digital Farmer", level: "Beginner", status: "In Progress" },
  { id: "cert2", title: "Investment Strategist", level: "Intermediate", status: "Available" },
  { id: "cert3", title: "Governance Expert", level: "Advanced", status: "Locked" },
];

const EducationPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { enrolledCourses, enrollCourse, balance } = useNdc();
  const { toast } = useToast();

  const filteredCourses = recommended.filter(r => activeCategory === "All" || r.category === activeCategory);

  const handleEnroll = (courseId: string) => {
    if (enrolledCourses.includes(courseId)) {
      toast({ title: "Already Enrolled", description: "You're already enrolled in this course." });
      return;
    }
    if (balance < 200) {
      toast({ title: "Insufficient Balance", description: "You need 200 NDC to enroll. Current balance: " + balance.toLocaleString() + " NDC.", variant: "destructive" });
      return;
    }
    const ok = enrollCourse(courseId);
    if (ok) {
      toast({ title: "Enrolled! 🎉", description: "200 NDC deducted. You can now access this course." });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-foreground">Education Hub</h1>
          <span className="text-xs font-semibold text-primary">{balance.toLocaleString()} NDC</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses and certificates..." className="pl-9 h-10 rounded-xl" />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${activeCategory === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Your Progress */}
        <div>
          <h2 className="font-bold text-foreground text-sm mb-3">Your Progress</h2>
          <Card className="border shadow-sm overflow-hidden">
            <div className="h-2 bg-primary" style={{ width: `${currentCourse.progress}%` }} />
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-foreground">{currentCourse.title}</h3>
                  <p className="text-[10px] text-muted-foreground">{currentCourse.completed}/{currentCourse.modules} modules • {currentCourse.progress}% complete</p>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 font-bold text-xs h-9 rounded-xl gap-1">
                <Play className="h-3.5 w-3.5" /> Resume
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recommended */}
        <div>
          <h2 className="font-bold text-foreground text-sm mb-3">Recommended for You</h2>
          <div className="space-y-3">
            {filteredCourses.map((r) => {
              const enrolled = enrolledCourses.includes(r.id);
              return (
                <Card key={r.id} className="border shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-sm text-foreground">{r.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{r.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.duration}</span>
                        <span>{r.modules} modules</span>
                      </div>
                      {enrolled ? (
                        <Button size="sm" className="text-[10px] h-7 rounded-lg font-bold gap-1">
                          <Play className="h-3 w-3" /> Learn
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="text-[10px] h-7 rounded-lg font-bold gap-1"
                          onClick={() => handleEnroll(r.id)}>
                          <Lock className="h-3 w-3" /> 200 NDC
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Certificates */}
        <div>
          <h2 className="font-bold text-foreground text-sm mb-3">Certificate Programs</h2>
          <div className="space-y-2">
            {certificates.map((c) => (
              <Card key={c.id} className="border shadow-sm">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xs text-foreground">{c.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{c.level}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    c.status === "In Progress" ? "bg-primary/10 text-primary" :
                    c.status === "Available" ? "bg-accent/20 text-accent-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>{c.status}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default EducationPage;
