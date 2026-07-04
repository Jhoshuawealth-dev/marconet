import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "mn.pwa.installDismissedAt";
const COOLDOWN_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const InstallPrompt = () => {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() - dismissed < COOLDOWN_MS) return;

    // Already installed?
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", () => setVisible(false));
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice;
    setVisible(false);
  };

  if (!visible || !evt) return null;

  return (
    <div className="fixed bottom-[84px] left-4 right-4 z-[60] max-w-md mx-auto">
      <div className="rounded-2xl bg-card border border-border/60 shadow-elevated p-4 flex items-center gap-3 backdrop-blur-xl">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <Download className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-foreground text-sm">Install Marco Net</p>
          <p className="text-[11px] text-muted-foreground">Add to home screen for quick access.</p>
        </div>
        <Button size="sm" onClick={install} className="h-8 rounded-full text-[11px] px-3">
          Install
        </Button>
        <button onClick={dismiss} aria-label="Dismiss" className="p-1 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
