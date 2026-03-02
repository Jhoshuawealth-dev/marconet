import { Sprout } from "lucide-react";

const Footer = () => (
  <footer className="py-12 bg-foreground text-background">
    <div className="container max-w-6xl mx-auto">
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
            <li><a href="#" className="hover:text-background transition-colors">Dashboard</a></li>
            <li><a href="#" className="hover:text-background transition-colors">Invest</a></li>
            <li><a href="#" className="hover:text-background transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-background transition-colors">Education</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li><a href="#" className="hover:text-background transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-background transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-background transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3 text-sm">Legal</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-background transition-colors">Platform Charter</a></li>
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
