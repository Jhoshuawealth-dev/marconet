import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  { name: "Adebayo O.", role: "Digital Farmer", quote: "I started farming data 3 months ago and my returns have been incredibly consistent. This platform just works." },
  { name: "Chioma N.", role: "Investor", quote: "The transparency is refreshing. I can see every yield stream and exactly how my NDC is growing." },
  { name: "Emeka J.", role: "Community Leader", quote: "Marco Net brought real people together. The governance system gives us a voice in every decision." },
];

const Testimonials = () => (
  <section className="py-20 bg-muted/50">
    <div className="container max-w-6xl mx-auto">
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
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                  {t.name[0]}
                </div>
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
