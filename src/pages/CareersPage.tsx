import { ArrowLeft, MapPin, Clock, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const jobs = [
  { title: "Frontend Engineer", location: "Remote", type: "Full-time", dept: "Engineering" },
  { title: "Product Designer", location: "Lagos, Nigeria", type: "Full-time", dept: "Design" },
  { title: "Community Manager", location: "Remote", type: "Part-time", dept: "Growth" },
  { title: "Blockchain Developer", location: "Remote", type: "Full-time", dept: "Engineering" },
];

const CareersPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-extrabold text-foreground">Careers</h1>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Join our mission to revolutionize digital farming. We're looking for passionate people who believe in sustainable agriculture and financial inclusion.
        </p>
        <div className="space-y-3">
          {jobs.map((j) => (
            <Card key={j.title} className="border shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-sm text-foreground">{j.title}</h3>
                <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {j.type}</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {j.dept}</span>
                </div>
                <Button size="sm" variant="outline" className="mt-3 text-xs font-bold h-8 rounded-xl">Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
