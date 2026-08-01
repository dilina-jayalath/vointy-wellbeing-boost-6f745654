import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HeartPulse, Users, ClipboardList, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
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
  respondents: number;
  respondents_30d: number;
  response_rate: number;
  total_answers: number;
  avg_score: number;
  avg_score_30d: number;
  avg_score_prev_30d: number;
  score_change: number;
  active_surveys: number;
}
interface MonthlyRow {
  month: string;
  avg_score: number;
  respondents: number;
  answers: number;
}
interface QuestionRow {
  question_id: string;
  question: Record<string, string> | string | null;
  question_type: string;
  responses: number;
  respondents: number;
  avg_score: number;
}
interface TeamRow {
  team_id: string;
  team_name: string;
  members: number;
  respondents: number;
  avg_score: number;
  response_rate: number;
}
interface BucketRow {
  bucket: string;
  employees: number;
}

const Wellbeing = () => {
  const { t, language } = useTranslation() as any;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthly, setMonthly] = useState<MonthlyRow[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [buckets, setBuckets] = useState<BucketRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const db = supabase as any;
      const [ov, mo, qu, te, di] = await Promise.all([
        db.rpc("org_wellbeing_overview"),
        db.rpc("org_wellbeing_monthly"),
        db.rpc("org_wellbeing_questions"),
        db.rpc("org_team_wellbeing"),
        db.rpc("org_wellbeing_distribution"),
      ]);
      if (cancelled) return;
      const firstError = [ov, mo, qu, te, di].find((r) => r.error)?.error;
      if (firstError) {
        setError(firstError.message ?? "error");
      } else {
        setError(null);
        setOverview((ov.data?.[0] as Overview) ?? null);
        setMonthly((mo.data as MonthlyRow[]) ?? []);
        setQuestions((qu.data as QuestionRow[]) ?? []);
        setTeams((te.data as TeamRow[]) ?? []);
        setBuckets((di.data as BucketRow[]) ?? []);
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
    score: Number(m.avg_score),
    respondents: Number(m.respondents),
  }));

  const questionLabel = (q: QuestionRow) => {
    const raw = q.question;
    if (!raw) return "—";
    if (typeof raw === "string") return raw;
    return raw[language] ?? raw.en ?? Object.values(raw)[0] ?? "—";
  };

  const questionData = questions.slice(0, 10).map((q) => ({
    name: questionLabel(q).slice(0, 28),
    score: Number(q.avg_score),
  }));

  const bucketValue = (name: string) =>
    Number(buckets.find((b) => b.bucket === name)?.employees ?? 0);

  const responseRate = Number(overview?.response_rate ?? 0);
  const change = Number(overview?.score_change ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">
          {t("employerPanel.wellbeing.title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("employerPanel.wellbeing.description")}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("employerPanel.wellbeing.errorTitle")}</AlertTitle>
          <AlertDescription>{t("employerPanel.wellbeing.errorBody")}</AlertDescription>
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
                  <HeartPulse className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.wellbeing.kpi.avgScore")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">{overview?.avg_score ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.wellbeing.kpi.last30Days")}: {overview?.avg_score_30d ?? 0}
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
                  {t("employerPanel.wellbeing.kpi.change")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {change > 0 ? "+" : ""}
                  {change.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.wellbeing.kpi.vsPrev30Days")}: {overview?.avg_score_prev_30d ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.wellbeing.kpi.responseRate")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-4xl font-bold text-brand-blue">{responseRate}%</p>
                <Progress value={responseRate} />
                <p className="text-xs text-muted-foreground">
                  {overview?.respondents ?? 0}/{overview?.total_employees ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <ClipboardList className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.wellbeing.kpi.answers")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">{overview?.total_answers ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.wellbeing.kpi.activeSurveys")}: {overview?.active_surveys ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.wellbeing.monthlyTitle")}
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
                    dataKey="score"
                    name={t("employerPanel.wellbeing.chart.score") as string}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="respondents"
                    name={t("employerPanel.wellbeing.chart.respondents") as string}
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-muted-foreground">
                  {t("employerPanel.wellbeing.questionsTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {questionData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("employerPanel.wellbeing.noData")}
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={questionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" fontSize={12} />
                      <YAxis type="category" dataKey="name" width={150} fontSize={11} />
                      <Tooltip />
                      <Bar
                        dataKey="score"
                        name={t("employerPanel.wellbeing.chart.score") as string}
                        fill="hsl(var(--primary))"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base text-muted-foreground">
                  {t("employerPanel.wellbeing.distributionTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {["high", "medium", "low"].map((b) => {
                  const value = bucketValue(b);
                  const total = buckets.reduce((s, x) => s + Number(x.employees), 0);
                  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                  return (
                    <div key={b} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{t(`employerPanel.wellbeing.buckets.${b}`)}</span>
                        <span className="text-muted-foreground">
                          {value} ({pct}%)
                        </span>
                      </div>
                      <Progress value={pct} />
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground pt-2">
                  {t("employerPanel.wellbeing.privacyNote")}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">
                {t("employerPanel.wellbeing.teamsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("employerPanel.wellbeing.noData")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("employerPanel.wellbeing.table.team")}</TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.wellbeing.table.members")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.wellbeing.table.respondents")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.wellbeing.table.responseRate")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.wellbeing.table.avgScore")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((row) => (
                      <TableRow key={row.team_id}>
                        <TableCell className="font-medium">{row.team_name}</TableCell>
                        <TableCell className="text-right">{row.members}</TableCell>
                        <TableCell className="text-right">{row.respondents}</TableCell>
                        <TableCell className="text-right">{row.response_rate}%</TableCell>
                        <TableCell className="text-right">{row.avg_score}</TableCell>
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

export default Wellbeing;
