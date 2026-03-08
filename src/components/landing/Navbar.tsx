import { Sprout, Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

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
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted/80 hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
          </button>
          <Link to="/signup">
            <Button size="sm">Launch App</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted/80"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
          </button>
          <button onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
