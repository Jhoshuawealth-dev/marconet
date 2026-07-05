import { useEffect, useState } from "react";
import { Download, X, Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "mn.pwa.installDismissedAt";
const COOLDOWN_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

type Mode = "hidden" | "native" | "ios";

const isIos = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iOSUA = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports as Mac; detect via touch points
  const iPadOS =
    ua.includes("Mac") && typeof document !== "undefined" && "ontouchend" in document;
  return iOSUA || iPadOS;
};

const isSafari = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  // Exclude Chrome/Firefox/Edge on iOS (CriOS/FxiOS/EdgiOS)
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|OPT\//.test(ua);
};

const isStandalone = () => {
  if (typeof window === "undefined") return false;
  const mm = window.matchMedia?.("(display-mode: standalone)").matches;
  // iOS Safari legacy flag
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone;
  return Boolean(mm || iosStandalone);
};

const InstallPrompt = () => {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [mode, setMode] = useState<Mode>("hidden");

  useEffect(() => {
    const dismissed = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() - dismissed < COOLDOWN_MS) return;
    if (isStandalone()) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      setMode("native");
    };
    const onInstalled = () => setMode("hidden");
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    // iOS Safari never fires beforeinstallprompt — show a manual guide instead.
    if (isIos() && isSafari()) {
      // Small delay so it doesn't flash on first paint.
      const t = window.setTimeout(() => setMode("ios"), 1500);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onBIP);
        window.removeEventListener("appinstalled", onInstalled);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setMode("hidden");
  };

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice;
    setMode("hidden");
  };

  if (mode === "hidden") return null;

  if (mode === "ios") {
    return (
      <div className="fixed bottom-[84px] left-4 right-4 z-[60] app-container">
        <div className="rounded-2xl bg-card border border-border/60 shadow-elevated p-4 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <Download className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-foreground text-sm">Install Marco Net</p>
              <p className="text-[11px] text-muted-foreground mb-2">
                Add to your Home Screen for a full-screen app experience.
              </p>
              <div className="flex flex-wrap items-center gap-1 text-[11px] text-foreground/90">
                <span>Tap</span>
                <Share className="h-3.5 w-3.5 text-primary" aria-label="Share" />
                <span>in Safari, then</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5">
                  <Plus className="h-3 w-3" /> Add to Home Screen
                </span>
              </div>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[84px] left-4 right-4 z-[60] app-container">
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
