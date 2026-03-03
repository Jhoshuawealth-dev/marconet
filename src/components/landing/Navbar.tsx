import { Sprout, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <Sprout className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold text-foreground tracking-tight">Marco Net Farming</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#projects" className="hover:text-foreground transition-colors">Projects</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          <Link to="/signup">
            <Button size="sm">Launch App</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background px-4 pb-4 pt-2 flex flex-col gap-3 text-sm font-medium">
          <a href="#how-it-works" onClick={() => setOpen(false)} className="py-2 text-muted-foreground">How It Works</a>
          <a href="#projects" onClick={() => setOpen(false)} className="py-2 text-muted-foreground">Projects</a>
          <a href="#faq" onClick={() => setOpen(false)} className="py-2 text-muted-foreground">FAQ</a>
          <Link to="/signup" onClick={() => setOpen(false)}>
            <Button className="w-full" size="sm">Launch App</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
