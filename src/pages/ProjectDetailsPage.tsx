import { ArrowLeft, TrendingUp, Clock, Shield, Leaf, Droplets, Sun, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useNdc } from "@/contexts/NdcContext";

const projectData: Record<string, { name: string; roi: string; duration: string; risk: string; raised: number; description: string }> = {
  "1": { name: "Green Valley Soy", roi: "18.5%", duration: "6 months", risk: "Low", raised: 72, description: "Premium soybean digital farming project located in the fertile Green Valley region." },
  "2": { name: "Sunrise Maize Field", roi: "22.0%", duration: "4 months", risk: "Medium", raised: 45, description: "Fast-cycle maize project with competitive returns." },
  "3": { name: "Cassava Digital Farm", roi: "15.2%", duration: "8 months", risk: "Low", raised: 88, description: "Established cassava farm with consistent yields." },
  "4": { name: "Rice Paddy Project", roi: "20.0%", duration: "5 months", risk: "Medium", raised: 60, description: "Rice cultivation project leveraging AI monitoring." },
  "5": { name: "Cocoa Bean Estate", roi: "25.0%", duration: "12 months", risk: "High", raised: 15, description: "Premium cocoa estate with high returns." },
};

const supplyChain = [
  { step: "Seed Planting", status: "completed" },
  { step: "Growth Monitoring", status: "completed" },
  { step: "Yield Verification", status: "active" },
  { step: "Harvest & Distribution", status: "pending" },
];

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const project = projectData[id || "1"] || projectData["1"];
  const { stakedProjects } = useNdc();
  const staked = stakedProjects[id || "1"] || 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="app-container">
        <div className="bg-primary text-primary-foreground p-5 pb-8 relative">
          <button onClick={() => navigate(-1)} className="mb-4"><ArrowLeft className="h-5 w-5" /></button>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent uppercase">{project.risk} Risk</span>
          <h1 className="text-2xl font-extrabold mt-2">{project.name}</h1>
          <p className="text-sm text-primary-foreground/70 mt-2 leading-relaxed">{project.description}</p>
        </div>

        <div className="px-4 -mt-4 space-y-5">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
              <div><TrendingUp className="h-5 w-5 text-accent mx-auto mb-1" /><p className="text-lg font-extrabold text-foreground">{project.roi}</p><p className="text-[10px] text-muted-foreground">Target ROI</p></div>
              <div><Clock className="h-5 w-5 text-primary mx-auto mb-1" /><p className="text-lg font-extrabold text-foreground">{project.duration}</p><p className="text-[10px] text-muted-foreground">Duration</p></div>
              <div><Shield className="h-5 w-5 text-secondary mx-auto mb-1" /><p className="text-lg font-extrabold text-foreground">{project.risk}</p><p className="text-[10px] text-muted-foreground">Risk Level</p></div>
            </CardContent>
          </Card>

          {staked > 0 && (
            <Card className="border shadow-sm bg-primary/5">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Your Stake</p>
                <p className="text-xl font-extrabold text-primary">{staked.toLocaleString()} NDC</p>
              </CardContent>
            </Card>
          )}

          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold text-foreground">Funding Progress</span>
                <span className="text-primary font-bold">{project.raised}%</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${project.raised}%` }} />
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="font-bold text-foreground text-sm mb-3">Supply Chain Flow</h2>
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {supplyChain.map((s, i) => (
                    <div key={s.step} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        s.status === "completed" ? "bg-primary text-primary-foreground" : s.status === "active" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                      }`}>{s.status === "completed" ? <CheckCircle className="h-4 w-4" /> : i + 1}</div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold ${s.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>{s.step}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{s.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="font-bold text-foreground text-sm mb-3">Environmental Impact</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Leaf, label: "CO₂ Offset", value: "2.4 tons" },
                { icon: Droplets, label: "Water Saved", value: "15K L" },
                { icon: Sun, label: "Solar Used", value: "85%" },
              ].map((e) => (
                <Card key={e.label} className="border shadow-sm">
                  <CardContent className="p-3 text-center">
                    <e.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xs font-extrabold text-foreground">{e.value}</p>
                    <p className="text-[10px] text-muted-foreground">{e.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Link to={`/invest/${id || "1"}/stake`}>
            <Button size="lg" className="w-full font-bold text-base h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
              🌱 Increase My Stake
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
