import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BottomNav from "@/components/app/BottomNav";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/app/PageTransition";

const PersonalInfoPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: "John",
    lastName: "Farmer",
    email: "john.farmer@example.com",
    phone: "+234 812 345 6789",
    location: "Lagos, Nigeria",
    farmName: "Green Valley Farms",
  });

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    toast({ title: "Profile Updated ✅", description: "Your personal information has been saved." });
  };

  const fields = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email Address", type: "email" },
    { key: "phone", label: "Phone Number", type: "tel" },
    { key: "location", label: "Location" },
    { key: "farmName", label: "Farm Name" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <div className="flex items-center gap-3">
            <Link to="/profile"><ArrowLeft className="h-5 w-5 text-foreground" /></Link>
            <h1 className="text-xl font-extrabold text-foreground">Personal Information</h1>
          </div>

          {/* Avatar */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto text-primary font-extrabold text-xl">
              {form.firstName[0]}{form.lastName[0]}
            </div>
            <Button variant="link" className="text-xs mt-2 text-primary font-semibold">Change Photo</Button>
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-4">
              {fields.map(f => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">{f.label}</Label>
                  <Input
                    type={f.type || "text"}
                    value={(form as any)[f.key]}
                    onChange={e => update(f.key, e.target.value)}
                    className="rounded-xl h-10"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full font-bold rounded-xl h-12 gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default PersonalInfoPage;
