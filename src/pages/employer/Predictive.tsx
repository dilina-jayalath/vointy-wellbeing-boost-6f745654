import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  UserX,
  Users,
  PiggyBank,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";

interface Overview {
  total_employees: number;
  index_this_month: number;
  index_prev_month: number;
  forecast_next_month: number;
  trend_slope: number;
  trend_direction: string;
  high_risk_employees: number;
  medium_risk_employees: number;
  high_risk_teams: number;
  projected_sick_days_next_12m: number;
  projected_savings_next_12m: number;
}
interface ForecastRow {
  month: string;
  index_per_employee: number | null;
  forecast: number | null;
  is_forecast: boolean;
}
interface EmployeeRisk {
  user_id: string;
  display_name: string;
  last_active: string | null;
  days_since_active: number;
  points_30d: number;
  points_prev_30d: number;
  change_pct: number | null;
  risk_score: number;
  risk_level: string;
}
interface TeamRisk {
  team_id: string;
  team_name: string;
  members: number;
  active_members_30d: number;
  points_30d: number;
  points_prev_30d: number;
  change_pct: number | null;
  participation_rate: number;
  risk_level: string;
}

const Predictive = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [forecast, setForecast] = useState<ForecastRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeRisk[]>([]);
  const [teams, setTeams] = useState<TeamRisk[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const db = supabase as any;
      const [ov, fc, er, tr] = await Promise.all([
        db.rpc("org_predictive_overview"),
        db.rpc("org_activity_forecast"),
        db.rpc("org_employee_risk"),
        db.rpc("org_team_risk"),
      ]);
      if (cancelled) return;
      const firstError = [ov, fc, er, tr].find((r: any) => r.error)?.error;
      if (firstError) {
        setError(firstError.message ?? "error");
      } else {
        setError(null);
        setOverview((ov.data?.[0] as Overview) ?? null);
        setForecast((fc.data as ForecastRow[]) ?? []);
        setEmployees((er.data as EmployeeRisk[]) ?? []);
        setTeams((tr.data as TeamRisk[]) ?? []);
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

  const lastActual = [...forecast].reverse().find((r) => !r.is_forecast);
  const chartData = forecast.map((r) => ({
    month: monthLabel(r.month),
    actual: r.is_forecast ? null : Number(r.index_per_employee ?? 0),
    forecast: r.is_forecast
      ? Number(r.forecast ?? 0)
      : r.month === lastActual?.month
      ? Number(r.index_per_employee ?? 0)
      : null,
  }));

  const riskBadge = (level: string) => {
    const variant =
      level === "high" ? "destructive" : level === "medium" ? "secondary" : "outline";
    return <Badge variant={variant as any}>{t(`employerPanel.predictive.risk.${level}`)}</Badge>;
  };

  const TrendIcon =
    overview?.trend_direction === "up"
      ? TrendingUp
      : overview?.trend_direction === "down"
      ? TrendingDown
      : Minus;

  const changeText = (pct: number | null) =>
    pct === null || pct === undefined ? "–" : `${pct > 0 ? "+" : ""}${pct}%`;

  const dateLabel = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString() : t("employerPanel.predictive.never");

  const atRisk = employees.filter((e) => e.risk_level !== "low").slice(0, 25);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">
          {t("employerPanel.predictive.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("employerPanel.predictive.description")}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("employerPanel.predictive.errorTitle")}</AlertTitle>
          <AlertDescription>{t("employerPanel.predictive.errorBody")}</AlertDescription>
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
                  <Brain className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.predictive.kpi.forecast")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {overview?.forecast_next_month ?? 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendIcon className="h-4 w-4" />
                  {t(`employerPanel.predictive.trend.${overview?.trend_direction ?? "flat"}`)} ·{" "}
                  {t("employerPanel.predictive.kpi.thisMonth")}: {overview?.index_this_month ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <UserX className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.predictive.kpi.highRiskEmployees")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {overview?.high_risk_employees ?? 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.predictive.kpi.mediumRisk")}:{" "}
                  {overview?.medium_risk_employees ?? 0} / {overview?.total_employees ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.predictive.kpi.highRiskTeams")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {overview?.high_risk_teams ?? 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.predictive.kpi.ofTeams")}: {teams.length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <PiggyBank className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.predictive.kpi.projectedSickDays")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {overview?.projected_sick_days_next_12m ?? 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.predictive.kpi.projectedSavings")}: €
                  {overview?.projected_savings_next_12m ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.predictive.chartTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name={t("employerPanel.predictive.legend.actual")}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    name={t("employerPanel.predictive.legend.forecast")}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    connectNulls
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.predictive.teamRiskTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("employerPanel.predictive.noTeams")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("employerPanel.predictive.table.team")}</TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.predictive.table.members")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.predictive.table.participation")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.predictive.table.change")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.predictive.table.risk")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((tm) => (
                      <TableRow key={tm.team_id}>
                        <TableCell className="font-medium">{tm.team_name}</TableCell>
                        <TableCell className="text-right">
                          {tm.active_members_30d}/{tm.members}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span>{tm.participation_rate}%</span>
                            <Progress value={Number(tm.participation_rate)} className="w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{changeText(tm.change_pct)}</TableCell>
                        <TableCell className="text-right">{riskBadge(tm.risk_level)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                <UserX className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.predictive.employeeRiskTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {atRisk.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("employerPanel.predictive.noRisk")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("employerPanel.predictive.table.employee")}</TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.predictive.table.lastActive")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.predictive.table.points30d")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.predictive.table.change")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.predictive.table.riskScore")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.predictive.table.risk")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atRisk.map((e) => (
                      <TableRow key={e.user_id}>
                        <TableCell className="font-medium">{e.display_name}</TableCell>
                        <TableCell className="text-right">{dateLabel(e.last_active)}</TableCell>
                        <TableCell className="text-right">
                          {e.points_30d} ({e.points_prev_30d})
                        </TableCell>
                        <TableCell className="text-right">{changeText(e.change_pct)}</TableCell>
                        <TableCell className="text-right">{e.risk_score}</TableCell>
                        <TableCell className="text-right">{riskBadge(e.risk_level)}</TableCell>
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
                {t("employerPanel.predictive.methodTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>{t("employerPanel.predictive.method1")}</p>
              <p>{t("employerPanel.predictive.method2")}</p>
              <p>{t("employerPanel.predictive.method3")}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Predictive;
