import { ArrowLeft, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const posts = [
  { title: "The Future of Digital Farming in Africa", author: "Marco Team", date: "Feb 28, 2026", excerpt: "Exploring how technology is transforming traditional agriculture into a digital-first investment landscape." },
  { title: "Understanding NDC: Your Digital Harvest Currency", author: "Sarah K.", date: "Feb 25, 2026", excerpt: "A comprehensive guide to how NDC works, how to earn it, and what makes it valuable." },
  { title: "5 Tips for Maximizing Your Farm Yield", author: "James O.", date: "Feb 20, 2026", excerpt: "Expert strategies from top-performing digital farmers in our community." },
  { title: "Governance Update: Q1 2026 Proposals", author: "Governance Council", date: "Feb 15, 2026", excerpt: "A summary of the latest community proposals and voting results." },
];

const BlogPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-extrabold text-foreground">Blog</h1>
        </div>
        <div className="space-y-4">
          {posts.map((p) => (
            <Card key={p.title} className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.excerpt}</p>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {p.author}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.date}</span>
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
