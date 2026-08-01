import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";
import { EMPLOYER_PRICE_ID, getPaddleEnvironment } from "@/lib/paddle";
import { PLAN_FEATURES } from "@/components/employer/EmployerPaywall";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const formatDate = (d: Date | null) =>
  d ? d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "—";

const Subscriptions = () => {
  const { user } = useAuth();
  const { orgId } = useEmployerOrg();
  const { subscription, isActive, isTrialing, isPastDue, endsAt, loading, refresh } =
    useSubscription();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("checkout") === "success") {
      toast({
        title: "Thanks!",
        description: "Your Employer panel plan is being activated.",
      });
      const t = setTimeout(refresh, 2500);
      return () => clearTimeout(t);
    }
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
        title: "Could not open billing portal",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const statusLabel = !subscription
    ? "No plan"
    : isTrialing
      ? "Free trial"
      : subscription.status === "active"
        ? "Active"
        : subscription.status === "past_due"
          ? "Payment failed"
          : subscription.status === "canceled"
            ? "Cancelled"
            : subscription.status;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">Subscription &amp; billing</h1>
        <p className="text-muted-foreground mt-1">Manage your Vointy Employer panel plan.</p>
      </div>

      {isPastDue && (
        <Card className="border-orange-400 bg-orange-50">
          <CardContent className="flex items-start gap-3 pt-6 text-sm text-orange-900">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>
              The last payment failed. Your access continues while we retry — please update your
              payment method in the billing portal.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current plan: {loading ? "…" : statusLabel}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {subscription ? (
              <>
                <p>
                  Employer panel — €149/month
                  {subscription.cancel_at_period_end && " (cancels at period end)"}
                </p>
                <p className="text-muted-foreground">
                  {isTrialing
                    ? "Trial ends "
                    : subscription.status === "canceled"
                      ? "Access ends "
                      : "Renews "}
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
                  Invoices, payment method &amp; cancellation
                </Button>
              </>
            ) : (
              <p>
                Vointy is free for your employees and teams. The Employer panel — tracking,
                analytics, campaigns and events — requires a subscription.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-brand-purple">
          <CardHeader>
            <CardTitle>Employer panel — €149/month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="space-y-1">
              {PLAN_FEATURES.map((f) => (
                <li key={f} className="flex gap-2 items-center">
                  <CheckCircle2 className="h-4 w-4 text-brand-purple" /> {f}
                </li>
              ))}
            </ul>
            {isActive ? (
              <p className="text-muted-foreground">You are on this plan.</p>
            ) : (
              <Button
                className="w-full bg-brand-purple hover:bg-brand-purple-dark"
                onClick={startCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Start free 30-day trial
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              No setup fee · unlimited employees · cancel anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
