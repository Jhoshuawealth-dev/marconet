import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import avatarAdebayo from "@/assets/avatar-adebayo.jpg";
import avatarChioma from "@/assets/avatar-chioma.jpg";
import avatarEmeka from "@/assets/avatar-emeka.jpg";

const testimonials = [
  { name: "Adebayo O.", role: "Digital Farmer", avatar: avatarAdebayo, quote: "I started farming data 3 months ago and my returns have been incredibly consistent. This platform just works." },
  { name: "Chioma N.", role: "Investor", avatar: avatarChioma, quote: "The transparency is refreshing. I can see every yield stream and exactly how my NDC is growing." },
  { name: "Emeka J.", role: "Community Leader", avatar: avatarEmeka, quote: "Marco Net brought real people together. The governance system gives us a voice in every decision." },
];

import testimonialsBg from "@/assets/testimonials-bg.jpg";

const Testimonials = () => (
  <section className="relative py-20 bg-muted/50 overflow-hidden">
    <img
      src={testimonialsBg}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover opacity-15"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/70 to-muted/50" />
    <div className="container max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">What Our Farmers Say</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <Card key={t.name} className="border-0 shadow-md">
            <CardContent className="p-6 space-y-4">
              <Quote className="h-6 w-6 text-accent" />
              <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={t.avatar}
                  alt={`${t.name} portrait`}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="w-11 h-11 rounded-full object-cover border-2 border-accent/30"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
