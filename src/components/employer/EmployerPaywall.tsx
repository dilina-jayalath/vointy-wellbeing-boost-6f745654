import { CheckCircle2, Lock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { EMPLOYER_PRICE_ID } from "@/lib/paddle";
import { useTranslation } from "@/lib/i18n";

export const PLAN_FEATURES_KEYS = [
  "unlimitedEmployees",
  "unlimitedTeams",
  "allActivities",
  "teamBasedAccess",
  "createOwnActivities",
  "managementDashboard",
  "reporting",
  "noPerUserFees",
] as const;

export const PLAN_FEATURES = [
  "Unlimited employees",
  "Unlimited teams",
  "All 158 activities",
  "Team-based access",
  "Create your own activities",
  "Management dashboard",
  "Reporting",
  "No per-user fees",
];

/** Full-page paywall shown when the company has no active Employer Dashboard plan. */
const EmployerPaywall = () => {
  const { user } = useAuth();
  const { orgId, orgName } = useEmployerOrg();
  const { openCheckout, loading } = usePaddleCheckout();
  const { t } = useTranslation();

  const startCheckout = () => {
    if (!user) return;
    openCheckout({
      priceId: EMPLOYER_PRICE_ID,
      quantity: 1,
      customerEmail: user.email ?? undefined,
      customData: {
        userId: user.id,
        ...(orgId ? { organizationId: orgId } : {}),
      },
    });
  };

  const description = (t("employerPanel.paywall.description") as string).replace(
    "{orgPrefix}",
    orgName ? `${orgName} — ` : ""
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <Card className="max-w-xl w-full border-brand-purple">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-brand-purple/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-brand-purple" />
          </div>
          <CardTitle className="text-2xl text-brand-purple">
            {t("employerPanel.paywall.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4 text-center">
            <p className="text-3xl font-bold text-brand-purple">€149</p>
            <p className="text-sm text-muted-foreground">{t("employerPanel.paywall.priceSuffix")}</p>
          </div>
          <ul className="space-y-1 text-sm">
            {PLAN_FEATURES_KEYS.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-purple" />{" "}
                {t(`employerPanel.paywall.features.${f}`)}
              </li>
            ))}
          </ul>
          <Button
            className="w-full bg-brand-purple hover:bg-brand-purple-dark"
            onClick={startCheckout}
            disabled={loading || !user}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {t("employerPanel.paywall.startTrial")}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {t("employerPanel.paywall.disclaimer")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerPaywall;
