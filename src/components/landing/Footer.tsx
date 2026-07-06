import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import footerBg from "@/assets/footer-bg.jpg";

const Footer = () => (
  <footer className="relative pt-12 pb-8 bg-foreground text-background overflow-hidden">
    <img
      src={footerBg}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover opacity-20"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/95 to-foreground/80" />

    <div className="container max-w-6xl mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-accent" />
            <span className="font-bold text-lg">Marco Net Farming</span>
          </div>
          <p className="text-sm text-background/60 leading-relaxed">
            Digital farming platform built on trust, transparency, and sustainable returns.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-3 text-sm">Platform</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li><Link to="/signin" className="hover:text-background transition-colors">Dashboard</Link></li>
            <li><Link to="/signin" className="hover:text-background transition-colors">Invest</Link></li>
            <li><Link to="/signin" className="hover:text-background transition-colors">Community</Link></li>
            <li><Link to="/signin" className="hover:text-background transition-colors">Education</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li><Link to="/about" className="hover:text-background transition-colors">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-background transition-colors">Careers</Link></li>
            <li><Link to="/blog" className="hover:text-background transition-colors">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-background transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3 text-sm">Legal</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li><Link to="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-background transition-colors">Terms of Service</Link></li>
            <li><Link to="/platform-charter" className="hover:text-background transition-colors">Platform Charter</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-background/10 text-center text-xs text-background/40">
        © 2026 Marco Net Farming. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
