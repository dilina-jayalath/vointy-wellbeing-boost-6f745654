import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, Users, Star, TrendingUp, Trophy, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  LineChart,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";

interface Overview {
  total_employees: number;
  active_employees: number;
  total_exercises: number;
  total_points: number;
  exercises_30d: number;
  points_30d: number;
  avg_points_per_employee: number;
}
interface MonthlyRow {
  month: string;
  exercises: number;
  points: number;
  active_employees: number;
}
interface TopActivityRow {
  activity_id: string | null;
  title: string;
  category: string | null;
  times_performed: number;
  points: number;
}
interface TeamRow {
  team_id: string;
  team_name: string;
  members: number;
  exercises: number;
  points: number;
  avg_points_per_member: number;
}
interface EmployeeRow {
  user_id: string;
  display_name: string;
  exercises: number;
  points: number;
  last_active: string | null;
}

const ActivitySummary = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthly, setMonthly] = useState<MonthlyRow[]>([]);
  const [topActivities, setTopActivities] = useState<TopActivityRow[]>([]);
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const db = supabase as any;
      const [ov, mo, ta, te, em] = await Promise.all([
        db.rpc("org_activity_overview"),
        db.rpc("org_activity_monthly"),
        db.rpc("org_top_activities", { _limit: 10 }),
        db.rpc("org_team_activity"),
        db.rpc("org_employee_activity"),
      ]);
      if (cancelled) return;
      const firstError = [ov, mo, ta, te, em].find((r) => r.error)?.error;
      if (firstError) {
        setError(firstError.message ?? "error");
      } else {
        setError(null);
        setOverview((ov.data?.[0] as Overview) ?? null);
        setMonthly((mo.data as MonthlyRow[]) ?? []);
        setTopActivities((ta.data as TopActivityRow[]) ?? []);
        setTeams((te.data as TeamRow[]) ?? []);
        setEmployees((em.data as EmployeeRow[]) ?? []);
      }
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const participation =
    overview && overview.total_employees > 0
      ? Math.round((overview.active_employees / overview.total_employees) * 100)
      : 0;

  const monthLabel = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: "short", year: "2-digit" });

  const chartData = monthly.map((m) => ({
    month: monthLabel(m.month),
    exercises: Number(m.exercises),
    points: Number(m.points),
    active: Number(m.active_employees),
  }));

  const maxActivityCount = Math.max(1, ...topActivities.map((a) => Number(a.times_performed)));

  const dateLabel = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString() : t("employerPanel.activitySummary.never");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">
          {t("employerPanel.activitySummary.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("employerPanel.activitySummary.description")}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("employerPanel.activitySummary.errorTitle")}</AlertTitle>
          <AlertDescription>{t("employerPanel.activitySummary.errorBody")}</AlertDescription>
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
                  {t("employerPanel.activitySummary.kpi.totalExercises")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {overview?.total_exercises ?? 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.activitySummary.kpi.last30Days")}: {overview?.exercises_30d ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.activitySummary.kpi.totalPoints")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">{overview?.total_points ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.activitySummary.kpi.avgPerEmployee")}:{" "}
                  {overview?.avg_points_per_employee ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.activitySummary.kpi.activeEmployees")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {overview?.active_employees ?? 0}/{overview?.total_employees ?? 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.activitySummary.kpi.last30Days")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.activitySummary.kpi.participation")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-4xl font-bold text-brand-blue">{participation}%</p>
                <Progress value={participation} />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.activitySummary.monthlyTrend")}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="points"
                      name={t("employerPanel.activitySummary.kpi.totalPoints") as string}
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="active"
                      name={t("employerPanel.activitySummary.kpi.activeEmployees") as string}
                      stroke="hsl(var(--accent-foreground))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Trophy className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.activitySummary.topActivities")}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                {topActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("employerPanel.activitySummary.noData")}
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topActivities.map((a) => ({
                      name: a.title,
                      count: Number(a.times_performed),
                    }))} layout="vertical" margin={{ left: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} domain={[0, maxActivityCount]} />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        name={t("employerPanel.activitySummary.timesPerformed") as string}
                        fill="hsl(var(--primary))"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.activitySummary.teamComparison")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("employerPanel.activitySummary.noTeams")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("employerPanel.activitySummary.table.team")}</TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activitySummary.table.members")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activitySummary.table.exercises")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activitySummary.table.points")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activitySummary.table.avgPerMember")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((row) => (
                      <TableRow key={row.team_id}>
                        <TableCell className="font-medium">{row.team_name}</TableCell>
                        <TableCell className="text-right">{row.members}</TableCell>
                        <TableCell className="text-right">{row.exercises}</TableCell>
                        <TableCell className="text-right">{row.points}</TableCell>
                        <TableCell className="text-right">{row.avg_points_per_member}</TableCell>
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
                <Star className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.activitySummary.employeeSummary")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("employerPanel.activitySummary.noData")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("employerPanel.activitySummary.table.employee")}</TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activitySummary.table.exercises")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activitySummary.table.points")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.activitySummary.table.lastActive")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((row) => (
                      <TableRow key={row.user_id}>
                        <TableCell className="font-medium">{row.display_name}</TableCell>
                        <TableCell className="text-right">{row.exercises}</TableCell>
                        <TableCell className="text-right">{row.points}</TableCell>
                        <TableCell className="text-right">{dateLabel(row.last_active)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ActivitySummary;
