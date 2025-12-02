import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import {
  Trophy,
  Download,
  Smartphone,
  Check,
  Share,
  Plus,
  Apple,
  Chrome,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = [
    "Access your team anytime, even offline",
    "Get push notifications for events",
    "Quick access from your home screen",
    "No app store download needed",
  ];

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Already Installed!</h1>
          <p className="text-muted-foreground mb-6">
            GamePlan is already installed on your device. You can access it from your home screen.
          </p>
          <Button asChild variant="hero">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <BackButton fallbackPath="/" />
            <Link to="/" className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">GamePlan</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Smartphone className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Install GamePlan</h1>
          <p className="text-muted-foreground">
            Add GamePlan to your home screen for the best experience
          </p>
        </div>

        {/* Features */}
        <Card className="p-6 mb-6">
          <h2 className="font-bold mb-4">Why install?</h2>
          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Install Instructions */}
        {isIOS ? (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Apple className="h-6 w-6" />
              <h2 className="font-bold">Install on iPhone/iPad</h2>
            </div>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  1
                </span>
                <div>
                  <p className="font-medium">Tap the Share button</p>
                  <p className="text-sm text-muted-foreground">
                    Located at the bottom of your Safari browser
                  </p>
                  <div className="mt-2 p-2 bg-muted rounded-lg inline-flex items-center gap-2">
                    <Share className="h-5 w-5" />
                    <span className="text-sm">Share</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  2
                </span>
                <div>
                  <p className="font-medium">Select "Add to Home Screen"</p>
                  <p className="text-sm text-muted-foreground">
                    Scroll down in the share menu to find this option
                  </p>
                  <div className="mt-2 p-2 bg-muted rounded-lg inline-flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    <span className="text-sm">Add to Home Screen</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  3
                </span>
                <div>
                  <p className="font-medium">Tap "Add"</p>
                  <p className="text-sm text-muted-foreground">
                    Confirm by tapping Add in the top right corner
                  </p>
                </div>
              </li>
            </ol>
          </Card>
        ) : (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Chrome className="h-6 w-6" />
              <h2 className="font-bold">Install on Android/Desktop</h2>
            </div>
            {deferredPrompt ? (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Click the button below to install GamePlan on your device
                </p>
                <Button onClick={handleInstall} variant="hero" size="lg" className="w-full">
                  <Download className="h-5 w-5 mr-2" />
                  Install GamePlan
                </Button>
              </div>
            ) : (
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Open browser menu</p>
                    <p className="text-sm text-muted-foreground">
                      Tap the three dots in the top right corner
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Select "Install app" or "Add to Home Screen"</p>
                    <p className="text-sm text-muted-foreground">
                      The option may vary depending on your browser
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Confirm installation</p>
                    <p className="text-sm text-muted-foreground">
                      Tap "Install" in the confirmation dialog
                    </p>
                  </div>
                </li>
              </ol>
            )}
          </Card>
        )}

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link to="/dashboard">Continue in Browser</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Install;
