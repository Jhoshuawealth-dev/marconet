import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-extrabold text-foreground">Contact Us</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Mail, label: "Email", value: "hello@marconet.farm" },
            { icon: Phone, label: "Phone", value: "+234 800 123 4567" },
            { icon: MapPin, label: "Office", value: "Lagos, Nigeria" },
          ].map((c) => (
            <Card key={c.label} className="border shadow-sm">
              <CardContent className="p-4 text-center">
                <c.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xs font-bold text-foreground">{c.label}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{c.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border shadow-sm">
          <CardContent className="p-5 space-y-4">
            <h2 className="font-bold text-foreground">Send us a message</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Name</Label>
                <Input placeholder="Your name" className="h-10 rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Email</Label>
                <Input type="email" placeholder="your@email.com" className="h-10 rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Message</Label>
                <textarea placeholder="How can we help?" className="w-full h-24 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button className="w-full font-bold rounded-xl h-10">Send Message</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
