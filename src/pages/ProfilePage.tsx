import { ArrowLeft, Shield, Vote, Award, ChevronRight, User, Lock, Sprout, FileText, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";

const settingsItems = [
  { icon: User, label: "Personal Information", to: "/profile/personal" },
  { icon: Lock, label: "Security & 2FA", to: "/profile/security" },
  { icon: Sprout, label: "Farm Assets", to: "/profile/farms" },
  { icon: Shield, label: "Identity Verification", to: "/verification" },
];

const ProfilePage = () => (
  <div className="min-h-screen bg-background pb-20">
    <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
      {/* Profile Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto text-primary font-extrabold text-xl">
          JF
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-foreground">John Farmer</h1>
          <span className="inline-block text-[10px] font-bold px-3 py-1 rounded-full bg-accent/20 text-accent-foreground uppercase tracking-wider mt-1">
            Tier 2: Expert Producer
          </span>
          <p className="text-xs text-muted-foreground mt-1">Member since March 2025</p>
        </div>
      </div>

      {/* Governance Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border shadow-sm">
          <CardContent className="p-4 text-center">
            <Vote className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-extrabold text-foreground">12</p>
            <p className="text-[10px] text-muted-foreground">Proposals Voted</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 text-center">
            <Award className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-lg font-extrabold text-foreground">87</p>
            <p className="text-[10px] text-muted-foreground">Governance Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Governance Portal */}
      <Card className="border-2 border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">Governance Portal</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground">3 New</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Active proposals awaiting your vote</p>
            </div>
            <Button size="sm" className="font-bold text-xs h-8 rounded-xl">Vote Now</Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <div>
        <h2 className="font-bold text-foreground text-sm mb-3">Account Settings</h2>
        <div className="space-y-2">
          {settingsItems.map((item) => (
            <Link key={item.label} to={item.to}>
              <Card className="border shadow-sm mb-2">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-foreground">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="text-center space-y-2 pt-2">
        <Link to="/platform-charter" className="block text-xs text-primary font-semibold">Platform Charter</Link>
        <Link to="/terms" className="block text-xs text-muted-foreground">Code of Conduct</Link>
        <Button variant="ghost" className="text-destructive text-xs font-bold mt-2">Sign Out</Button>
      </div>
    </div>
    <BottomNav />
  </div>
);

export default ProfilePage;
