import { useState } from "react";
import { ArrowLeft, Clock, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const posts = [
  {
    id: 1,
    category: "Insights",
    title: "The Future of Digital Farming in Africa",
    author: "Marco Team",
    date: "Feb 28, 2026",
    readTime: "6 min read",
    excerpt: "Exploring how technology is transforming traditional agriculture into a digital-first investment landscape across the continent.",
    body: "Africa's agricultural sector employs 60% of its workforce but captures less than 20% of global agri-value. Digital farming platforms like Marco Net close that gap by giving smallholder farmers access to capital, tooling, and international markets. In this piece we break down the three shifts driving the change: mobile-first tokenized ownership, transparent yield reporting, and community governance that returns decision-making to farmers themselves.",
  },
  {
    id: 2,
    category: "Guides",
    title: "Understanding NDC: Your Digital Harvest Currency",
    author: "Sarah K.",
    date: "Feb 25, 2026",
    readTime: "4 min read",
    excerpt: "A comprehensive guide to how NDC works, how to earn it, and what makes it valuable in the Marco Net ecosystem.",
    body: "NDC (Naira Digital Coin) is the utility currency that powers everything on Marco Net — from mining rewards and staking payouts to ad spend and marketplace fees. Every NDC is backed 1:1 by verified farm output and community reserves. This guide walks you through the four ways to earn NDC, the conversion rates for cashing out, and how to protect your balance.",
  },
  {
    id: 3,
    category: "Farming",
    title: "5 Tips for Maximizing Your Farm Yield",
    author: "James O.",
    date: "Feb 20, 2026",
    readTime: "5 min read",
    excerpt: "Expert strategies from top-performing digital farmers in our community, distilled into five actions you can take today.",
    body: "After analyzing the top 100 yielding farms on Marco Net for six months, five habits stood out: diversifying across at least three crop categories, activating mining boosts during peak network hours, staking longer than 90 days for the compounding bonus, verifying identity to unlock premium pools, and referring at least two friends to activate the referral multiplier.",
  },
  {
    id: 4,
    category: "Governance",
    title: "Governance Update: Q1 2026 Proposals",
    author: "Governance Council",
    date: "Feb 15, 2026",
    readTime: "3 min read",
    excerpt: "A summary of the latest community proposals, voting results, and what changes are landing in the platform this quarter.",
    body: "This quarter the community voted on seven proposals. The three that passed: (1) reduce transfer fees from 1.5% to 1.0%, (2) add cassava co-ops from Ondo State to the featured projects rotation, and (3) increase the referral bonus from 150 NDC to 200 NDC. Voter turnout hit an all-time high of 34% of active NDC holders.",
  },
  {
    id: 5,
    category: "Education",
    title: "Why We Built a Free Education Hub",
    author: "Fatima B.",
    date: "Feb 10, 2026",
    readTime: "4 min read",
    excerpt: "Financial literacy shouldn't be gated. Here's the thinking behind opening every course on Marco Net at no cost.",
    body: "When we surveyed farmers about barriers to investing, cost of education came up more than cost of capital. So we made every course free and structured them into three tracks: crypto fundamentals, sustainable agriculture, and personal finance. Completing a track unlocks a small NDC bonus and priority access to new farm launches.",
  },
  {
    id: 6,
    category: "Impact",
    title: "How Marco Net Funded 200 New Farms in 2025",
    author: "Adaeze O.",
    date: "Jan 30, 2026",
    readTime: "7 min read",
    excerpt: "A year-in-review of the community capital deployed, farms onboarded, and yields shared across three countries.",
    body: "In 2025, our community deployed ₦840 million in patient capital across 217 new farms in Nigeria, Ghana, and Kenya. Average yield to investors was 18.4%, and 92% of funded farms remained profitable at year-end. This post breaks down the numbers farm by farm and shares what worked, what didn't, and what changes for 2026.",
  },
];

const categories = ["All", "Insights", "Guides", "Farming", "Governance", "Education", "Impact"];

const BlogPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);
  const filtered = active === "All" ? posts : posts.filter(p => p.category === active);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-display font-extrabold text-foreground">Blog</h1>
        </div>

        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Stories, strategies, and updates from the Marco Net community.
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {categories.map(c => (
            <button key={c} onClick={() => setActive(c)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
                active === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}>{c}</button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((p) => (
            <Card key={p.id} className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-5 space-y-2.5">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent">{p.category}</span>
                <h3 className="font-display font-extrabold text-foreground text-[15px] leading-tight">{p.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{p.excerpt}</p>
                {expanded === p.id && (
                  <p className="text-[13px] text-foreground leading-relaxed pt-1 border-t border-border/60">{p.body}</p>
                )}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {p.author}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.date} · {p.readTime}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    className="text-[11px] font-bold text-primary gap-1 h-7 px-2">
                    {expanded === p.id ? "Show less" : "Read"} <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
