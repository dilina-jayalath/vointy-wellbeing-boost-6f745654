import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, Users, Calendar, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";
import OrgIndexCard from "@/components/employer/OrgIndexCard";

interface Overview {
  total_employees: number;
  active_employees_30d: number;
  participation_rate: number;
  points_total: number;
  points_12m: number;
  points_this_month: number;
  points_prev_month: number;
  index_per_employee: number;
  index_this_month: number;
  index_prev_month: number;
  index_change: number;
}
interface MonthlyRow {
  month: string;
  points: number;
  exercises: number;
  active_employees: number;
  index_per_employee: number;
}
interface TeamRow {
  team_id: string;
  team_name: string;
  members: number;
  active_members: number;
  points: number;
  index_per_member: number;
}

const ActivityIndex = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthly, setMonthly] = useState<MonthlyRow[]>([]);
  const [teams, setTeams] = useState<TeamRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const db = supabase as any;
      const [ov, mo, te] = await Promise.all([
        db.rpc("org_activity_index_overview"),
        db.rpc("org_activity_index_monthly"),
        db.rpc("org_activity_index_teams"),
      ]);
      if (cancelled) return;
      const firstError = [ov, mo, te].find((r) => r.error)?.error;
      if (firstError) {
        setError(firstError.message ?? "error");
      } else {
        setError(null);
        setOverview((ov.data?.[0] as Overview) ?? null);
        setMonthly((mo.data as MonthlyRow[]) ?? []);
        setTeams((te.data as TeamRow[]) ?? []);
      }
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const monthLabel = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: "short", year: "2-digit" });

  const trendData = monthly.map((m) => ({
    month: monthLabel(m.month),
    index: Number(m.index_per_employee),
    points: Number(m.points),
    active: Number(m.active_employees),
  }));

  const participation = Number(overview?.participation_rate ?? 0);
  const change = Number(overview?.index_change ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">
          {t("employerPanel.activityIndexReport.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("employerPanel.activityIndexReport.description")}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("employerPanel.activityIndexReport.errorTitle")}</AlertTitle>
          <AlertDescription>{t("employerPanel.activityIndexReport.errorBody")}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Activity className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.activityIndexReport.kpi.indexPerEmployee")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {overview?.index_per_employee ?? 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.activityIndexReport.kpi.thisMonth")}:{" "}
                  {overview?.index_this_month ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  {change < 0 ? (
                    <TrendingDown className="h-4 w-4 text-brand-purple" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-brand-purple" />
                  )}
                  {t("employerPanel.activityIndexReport.kpi.change")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {change > 0 ? "+" : ""}
                  {change.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.activityIndexReport.kpi.prevMonth")}:{" "}
                  {overview?.index_prev_month ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.activityIndexReport.kpi.participation")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-4xl font-bold text-brand-blue">{participation}%</p>
                <Progress value={participation} />
                <p className="text-xs text-muted-foreground">
                  {overview?.active_employees_30d ?? 0}/{overview?.total_employees ?? 0}{" "}
                  {t("employerPanel.activityIndexReport.kpi.last30Days")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.activityIndexReport.kpi.points12m")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">{overview?.points_12m ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.activityIndexReport.kpi.pointsTotal")}:{" "}
                  {overview?.points_total ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <OrgIndexCard />


          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.activityIndexReport.monthlyTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="index"
                    name={t("employerPanel.activityIndexReport.chart.index") as string}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    name={t("employerPanel.activityIndexReport.chart.active") as string}
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">
                {t("employerPanel.activityIndexReport.teamsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("employerPanel.activityIndexReport.noData")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("employerPanel.activityIndexReport.table.team")}</TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activityIndexReport.table.members")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activityIndexReport.table.activeMembers")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activityIndexReport.table.points")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activityIndexReport.table.indexPerMember")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((row) => (
                      <TableRow key={row.team_id}>
                        <TableCell className="font-medium">{row.team_name}</TableCell>
                        <TableCell className="text-right">{row.members}</TableCell>
                        <TableCell className="text-right">{row.active_members}</TableCell>
                        <TableCell className="text-right">{row.points}</TableCell>
                        <TableCell className="text-right">{row.index_per_member}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">
                {t("employerPanel.activityIndexReport.calculationTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("employerPanel.activityIndexReport.calculationBody")}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ActivityIndex;
