import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, BookOpen, Megaphone, Users, Sprout } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNdc } from "@/contexts/NdcContext";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

// Shared static catalogs (mirrors InvestPage & EducationPage)
const FARM_PROJECTS = [
  { id: "1", name: "Green Valley Soy", meta: "ROI 18.5% · 6 months" },
  { id: "2", name: "Sunrise Maize Field", meta: "ROI 22.0% · 4 months" },
  { id: "3", name: "Cassava Digital Farm", meta: "ROI 15.2% · 8 months" },
  { id: "4", name: "Rice Paddy Project", meta: "ROI 20.0% · 5 months" },
  { id: "5", name: "Cocoa Bean Estate", meta: "ROI 25.0% · 12 months" },
];

const COURSES = [
  { id: "current", title: "Digital Farming Fundamentals", meta: "Digital Farming" },
  { id: "r1", title: "Smart Staking Strategies", meta: "Investment · 45 min" },
  { id: "r2", title: "Supply Chain Mastery", meta: "Digital Farming · 1h 20m" },
  { id: "r3", title: "AI Farming Deep Dive", meta: "AI Tools · 2h" },
  { id: "r4", title: "Governance Fundamentals", meta: "Governance · 30 min" },
];

interface Campaign { id: string; name: string; status: string; }

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearch = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { communityPosts } = useNdc();
  const [query, setQuery] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Load user's ad campaigns when opened
  useEffect(() => {
    if (!open || !user) return;
    supabase
      .from("ad_campaigns")
      .select("id, name, status")
      .eq("user_id", user.id)
      .limit(50)
      .then(({ data }) => setCampaigns((data as Campaign[]) || []));
  }, [open, user]);

  // Global Cmd/Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const q = query.trim().toLowerCase();
  const match = (s: string) => !q || s.toLowerCase().includes(q);

  const farms = useMemo(() => FARM_PROJECTS.filter(p => match(p.name) || match(p.meta)), [q]);
  const courses = useMemo(() => COURSES.filter(c => match(c.title) || match(c.meta)), [q]);
  const posts = useMemo(
    () => communityPosts.filter(p => match(p.title) || match(p.body) || match(p.author)).slice(0, 8),
    [q, communityPosts],
  );
  const camps = useMemo(() => campaigns.filter(c => match(c.name) || match(c.status)), [q, campaigns]);

  const go = (path: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search farms, campaigns, courses, posts…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {farms.length > 0 && (
          <CommandGroup heading="Farms">
            {farms.map(f => (
              <CommandItem key={`f-${f.id}`} value={`farm ${f.name}`} onSelect={() => go(`/invest/${f.id}`)}>
                <Sprout className="mr-2 h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm">{f.name}</span>
                  <span className="text-[10px] text-muted-foreground">{f.meta}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {camps.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Your Campaigns">
              {camps.map(c => (
                <CommandItem key={`c-${c.id}`} value={`campaign ${c.name}`} onSelect={() => go(`/ads/${c.id}`)}>
                  <Megaphone className="mr-2 h-4 w-4 text-accent" />
                  <div className="flex flex-col">
                    <span className="text-sm">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{c.status}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {courses.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Courses">
              {courses.map(c => (
                <CommandItem key={`co-${c.id}`} value={`course ${c.title}`} onSelect={() => go("/education")}>
                  <BookOpen className="mr-2 h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm">{c.title}</span>
                    <span className="text-[10px] text-muted-foreground">{c.meta}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {posts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Community Posts">
              {posts.map(p => (
                <CommandItem key={`p-${p.id}`} value={`post ${p.title}`} onSelect={() => go("/community")}>
                  <Users className="mr-2 h-4 w-4 text-accent" />
                  <div className="flex flex-col">
                    <span className="text-sm truncate max-w-[240px]">{p.title}</span>
                    <span className="text-[10px] text-muted-foreground">by {p.author} · {p.topic}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem value="go dashboard" onSelect={() => go("/dashboard")}>
            <TrendingUp className="mr-2 h-4 w-4" /> Dashboard
          </CommandItem>
          <CommandItem value="go wallet" onSelect={() => go("/wallet")}>
            <TrendingUp className="mr-2 h-4 w-4" /> Wallet
          </CommandItem>
          <CommandItem value="go mining" onSelect={() => go("/mining")}>
            <TrendingUp className="mr-2 h-4 w-4" /> Mining
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
