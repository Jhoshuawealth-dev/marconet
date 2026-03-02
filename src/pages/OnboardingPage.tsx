import { useState } from "react";
import { Sprout, TrendingUp, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    icon: Sprout,
    title: "Farm Your Data",
    desc: "Turn your everyday digital activity into real yield. Plant seeds, grow fields, and watch your NDC balance flourish.",
    color: "bg-primary",
  },
  {
    icon: TrendingUp,
    title: "Invest & Earn",
    desc: "Stake in verified farmland projects with transparent ROI. Your money grows while supporting sustainable agriculture.",
    color: "bg-accent",
  },
  {
    icon: Users,
    title: "Join the Community",
    desc: "Connect with farmers and investors. Vote on governance, share knowledge, and shape the future together.",
    color: "bg-primary",
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-between max-w-md mx-auto px-6 py-10">
      {/* Skip */}
      <div className="w-full flex justify-end">
        <button onClick={() => navigate("/signin")} className="text-sm text-muted-foreground font-medium">
          Skip
        </button>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        <div className={`w-28 h-28 rounded-3xl ${slides[current].color} flex items-center justify-center shadow-lg`}>
          {(() => {
            const Icon = slides[current].icon;
            return <Icon className="h-14 w-14 text-primary-foreground" />;
          })()}
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold text-foreground">{slides[current].title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{slides[current].desc}</p>
        </div>
      </div>

      {/* Dots + Button */}
      <div className="w-full space-y-6">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        <Button onClick={next} size="lg" className="w-full font-bold text-base gap-2">
          {current < slides.length - 1 ? "Next" : "Get Started"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPage;
