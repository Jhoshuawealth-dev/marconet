import { useState } from "react";
import { Sprout, TrendingUp, Users, ChevronRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    icon: Sprout,
    title: "Farm Your\nDigital Assets",
    desc: "Turn your everyday digital activity into real yield. Plant seeds, grow fields, and watch your NDC balance flourish.",
    accent: "gradient-primary",
    emoji: "🌱",
  },
  {
    icon: TrendingUp,
    title: "Invest in\nReal Agriculture",
    desc: "Stake in verified farmland projects with transparent ROI. Your money grows while supporting sustainable agriculture.",
    accent: "gradient-accent",
    emoji: "📈",
  },
  {
    icon: Users,
    title: "Join a Thriving\nCommunity",
    desc: "Connect with farmers and investors. Vote on governance, share knowledge, and shape the future of AgriTech together.",
    accent: "gradient-primary",
    emoji: "🤝",
  },
];

const OnboardingPage = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col app-container relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/[0.03] blur-3xl" />
      <div className="absolute bottom-32 left-0 w-48 h-48 rounded-full bg-accent/[0.05] blur-3xl" />

      {/* Skip */}
      <div className="px-6 pt-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-[13px] text-foreground">Marco Net</span>
        </div>
        <button onClick={() => navigate("/signin")} className="text-[12px] text-muted-foreground font-medium px-3 py-1.5 rounded-full hover:bg-muted transition-colors">
          Skip
        </button>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className={`w-28 h-28 rounded-[28px] ${slides[current].accent} flex items-center justify-center shadow-elevated`}>
              <span className="text-5xl">{slides[current].emoji}</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-[28px] font-display font-extrabold text-foreground leading-tight whitespace-pre-line">
                {slides[current].title}
              </h1>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[280px]">
                {slides[current].desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots + Button */}
      <div className="px-6 pb-10 space-y-6 relative z-10">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-[5px] rounded-full transition-all duration-300 ${
                i === current ? "w-8 gradient-primary" : "w-[5px] bg-border"
              }`}
            />
          ))}
        </div>

        <Button onClick={next} size="lg" className="w-full font-display font-bold text-[15px] gap-2 h-[52px] rounded-2xl gradient-primary border-0 shadow-elevated transition-all active:scale-[0.98]">
          {current < slides.length - 1 ? "Continue" : "Get Started"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPage;
