import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";
import { EMPLOYER_PRICE_ID, getPaddleEnvironment } from "@/lib/paddle";
import { PLAN_FEATURES_KEYS } from "@/components/employer/EmployerPaywall";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

const formatDate = (d: Date | null) =>
  d ? d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "—";

const Subscriptions = () => {
  const { user } = useAuth();
  const { orgId } = useEmployerOrg();
  const { subscription, isActive, isTrialing, isPastDue, endsAt, loading, refresh } =
    useSubscription();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const [portalLoading, setPortalLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("checkout") === "success") {
      toast({
        title: t("employerPanel.subscriptions.checkoutSuccessTitle") as string,
        description: t("employerPanel.subscriptions.checkoutSuccessDescription") as string,
      });
      const t2 = setTimeout(refresh, 2500);
      return () => clearTimeout(t2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const startCheckout = () => {
    if (!user) return;
    openCheckout({
      priceId: EMPLOYER_PRICE_ID,
      quantity: 1,
      customerEmail: user.email ?? undefined,
      customData: { userId: user.id, ...(orgId ? { organizationId: orgId } : {}) },
    });
  };

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        body: { environment: getPaddleEnvironment() },
      });
      if (error) throw error;
      const url = data?.overviewUrl ?? data?.subscriptionUrls?.[0]?.updateSubscriptionPaymentMethod;
      if (!url) throw new Error("Portal URL not available");
      window.open(url, "_blank");
    } catch (e) {
      toast({
        title: t("employerPanel.subscriptions.portalFailedTitle") as string,
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const statusLabel = !subscription
    ? (t("employerPanel.subscriptions.statuses.noPlan") as string)
    : isTrialing
      ? (t("employerPanel.subscriptions.statuses.trial") as string)
      : subscription.status === "active"
        ? (t("employerPanel.subscriptions.statuses.active") as string)
        : subscription.status === "past_due"
          ? (t("employerPanel.subscriptions.statuses.pastDue") as string)
          : subscription.status === "canceled"
            ? (t("employerPanel.subscriptions.statuses.canceled") as string)
            : subscription.status;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">{t("employerPanel.subscriptions.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("employerPanel.subscriptions.description")}</p>
      </div>

      {isPastDue && (
        <Card className="border-orange-400 bg-orange-50">
          <CardContent className="flex items-start gap-3 pt-6 text-sm text-orange-900">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>{t("employerPanel.subscriptions.pastDueWarning")}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {(t("employerPanel.subscriptions.currentPlan") as string).replace(
                "{status}",
                loading ? "…" : statusLabel
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {subscription ? (
              <>
                <p>
                  {t("employerPanel.subscriptions.planLine")}
                  {subscription.cancel_at_period_end && t("employerPanel.subscriptions.cancelsAtPeriodEnd")}
                </p>
                <p className="text-muted-foreground">
                  {isTrialing
                    ? t("employerPanel.subscriptions.trialEnds")
                    : subscription.status === "canceled"
                      ? t("employerPanel.subscriptions.accessEnds")
                      : t("employerPanel.subscriptions.renews")}
                  {formatDate(endsAt)}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={openPortal}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4 mr-2" />
                  )}
                  {t("employerPanel.subscriptions.portalButton")}
                </Button>
              </>
            ) : (
              <p>{t("employerPanel.subscriptions.noPlanDescription")}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-brand-purple">
          <CardHeader>
            <CardTitle>{t("employerPanel.subscriptions.planCardTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="space-y-1">
              {PLAN_FEATURES_KEYS.map((f) => (
                <li key={f} className="flex gap-2 items-center">
                  <CheckCircle2 className="h-4 w-4 text-brand-purple" /> {t(`employerPanel.subscriptions.features.${f}`)}
                </li>
              ))}
            </ul>
            {isActive ? (
              <p className="text-muted-foreground">{t("employerPanel.subscriptions.onThisPlan")}</p>
            ) : (
              <Button
                className="w-full bg-brand-purple hover:bg-brand-purple-dark"
                onClick={startCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("employerPanel.subscriptions.startTrial")}
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              {t("employerPanel.subscriptions.planDisclaimer")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
