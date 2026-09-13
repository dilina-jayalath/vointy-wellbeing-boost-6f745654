import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, MailCheck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";
import { useTranslation } from "@/lib/i18n";

const CompanyOverview = () => {
  const { orgId, orgName } = useEmployerOrg();
  const { t } = useTranslation();
  const [stats, setStats] = useState({ pending: 0, accepted: 0, teams: 0 });

  useEffect(() => {
    if (!orgId) return;
    (async () => {
      const [{ data: invites }, { count: teams }] = await Promise.all([
        supabase.from("organization_invitations").select("status").eq("organization_id", orgId),
        supabase.from("teams").select("id", { count: "exact", head: true }).eq("organization_id", orgId),
      ]);
      const rows = invites ?? [];
      setStats({
        pending: rows.filter((r) => r.status === "pending").length,
        accepted: rows.filter((r) => r.status === "accepted").length,
        teams: teams ?? 0,
      });
    })();
  }, [orgId]);

  const cards = [
    { label: t("companyWorkspace.overview.pending"), value: stats.pending, icon: MailCheck },
    { label: t("companyWorkspace.overview.accepted"), value: stats.accepted, icon: CheckCircle2 },
    { label: t("companyWorkspace.overview.teams"), value: stats.teams, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">{t("companyWorkspace.overview.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {orgName
            ? (t("companyWorkspace.overview.subtitleWithOrg") as string).replace("{orgName}", orgName)
            : t("companyWorkspace.overview.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <span className="h-10 w-10 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-2xl font-bold text-brand-dark">{c.value}</div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("companyWorkspace.overview.inviteTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("companyWorkspace.overview.inviteDescription")}</p>
            <Button asChild className="bg-brand-blue hover:bg-brand-blue/90">
              <Link to="/company/invite">
                <UserPlus className="h-4 w-4 mr-1" /> {t("companyWorkspace.nav.invite")}
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("companyWorkspace.overview.teamsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("companyWorkspace.overview.teamsDescription")}</p>
            <Button asChild variant="outline" className="border-brand-purple text-brand-purple">
              <Link to="/company/teams">
                <Users className="h-4 w-4 mr-1" /> {t("companyWorkspace.nav.teams")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("companyWorkspace.overview.stepsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
            <li>{t("companyWorkspace.overview.step1")}</li>
            <li>{t("companyWorkspace.overview.step2")}</li>
            <li>{t("companyWorkspace.overview.step3")}</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyOverview;
