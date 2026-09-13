import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Share, MoreVertical, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Platform = "ios" | "android" | "desktop";

const detectPlatform = (): Platform => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && "ontouchend" in document);
  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
};

const isInstalled = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  // iOS Safari
  (window.navigator as unknown as { standalone?: boolean }).standalone === true;

/**
 * Dismissible prompt that invites the user to install Vointy.
 * - Android/Chrome & desktop: triggers the native install prompt when available.
 * - iOS Safari: shows the manual "Share → Add to Home Screen" steps.
 */
const InstallAppPrompt = ({
  variant = "banner",
  storageKey = "vointy-install-prompt-dismissed",
  className = "",
}: {
  variant?: "banner" | "card";
  storageKey?: string;
  className?: string;
}) => {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isInstalled()) return;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(storageKey) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed) return;

    setPlatform(detectPlatform());
    setVisible(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [storageKey]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      if (choice.outcome === "accepted") dismiss();
      return;
    }
    setShowSteps(true);
  };

  if (!visible) return null;

  const title = platform === "ios" ? t("installPrompt.iosTitle") : t("installPrompt.title");
  const description =
    platform === "ios" ? t("installPrompt.iosDescription") : t("installPrompt.description");

  const steps =
    platform === "ios"
      ? [t("installPrompt.iosStep1"), t("installPrompt.iosStep2"), t("installPrompt.iosStep3")]
      : platform === "android"
        ? [t("installPrompt.androidStep1"), t("installPrompt.androidStep2"), t("installPrompt.androidStep3")]
        : [t("installPrompt.desktopStep1"), t("installPrompt.desktopStep2")];

  const StepIcon = platform === "ios" ? Share : MoreVertical;

  const content = (
    <>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Smartphone className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>

          {(showSteps || platform === "ios") && (
            <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  {i === 0 ? (
                    <StepIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                      {i + 1}
                    </span>
                  )}
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {platform !== "ios" && (
              <Button size="sm" onClick={install}>
                <Download className="mr-1.5 h-4 w-4" />
                {t("installPrompt.installCta")}
              </Button>
            )}
            <Button size="sm" variant="ghost" asChild>
              <Link to="/download">{t("installPrompt.moreCta")}</Link>
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("installPrompt.dismiss")}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );

  if (variant === "banner") {
    return (
      <div className={`border-b bg-muted/50 px-4 py-3 ${className}`}>{content}</div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">{content}</CardContent>
    </Card>
  );
};

export default InstallAppPrompt;
