import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import faqSupport from "@/assets/faq-support.jpg";

const faqs = [
  { q: "What is Marco Net Farming?", a: "Marco Net Farming is a digital investment platform that lets you stake in sustainable farmland projects and earn real NDC returns." },
  { q: "What is NDC?", a: "NDC (Net Data Credit) is the platform's currency used for staking, rewards, and withdrawals." },
  { q: "How do I earn yield?", a: "You earn yield by farming data, staking in projects, and participating in community activities. Returns are distributed automatically." },
  { q: "Is my investment safe?", a: "All projects are verified and transparently tracked. Your data and funds are protected with enterprise-grade security." },
  { q: "Can I withdraw my earnings?", a: "Yes! You can withdraw your NDC earnings at any time or reinvest them for compounded returns." },
];

const FAQSection = () => (
  <section id="faq" className="py-20 bg-background">
    <div className="container max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-5 gap-10 items-center">
        {/* Illustration */}
        <div className="lg:col-span-2 relative order-last lg:order-first">
          <div className="absolute -inset-3 bg-accent/10 rounded-3xl blur-2xl" />
          <img
            src={faqSupport}
            alt="Farmer reading answers on a laptop outdoors"
            loading="lazy"
            width={1024}
            height={1024}
            className="relative rounded-3xl shadow-xl object-cover w-full h-[360px]"
          />
        </div>

        {/* Questions */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Frequently Asked Questions</h2>
            <p className="mt-2 text-sm text-muted-foreground">Everything you need to know before you start farming.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  </section>
);

export default FAQSection;
