import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquare, Heart, Users, Trophy, AlertCircle, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
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
  posts: number;
  comments: number;
  likes: number;
  posters_30d: number;
  engaged_employees_30d: number;
  posts_30d: number;
  comments_30d: number;
  likes_30d: number;
  challenge_participants: number;
  challenge_completions: number;
  survey_respondents: number;
}
interface MonthlyRow {
  month: string;
  posts: number;
  comments: number;
  likes: number;
  contributors: number;
}
interface ContributorRow {
  user_id: string;
  display_name: string;
  posts: number;
  comments: number;
  likes: number;
  engagement_score: number;
  last_activity: string | null;
}
interface TeamRow {
  team_id: string;
  team_name: string;
  members: number;
  posts: number;
  comments: number;
  likes: number;
  active_members: number;
  engagement_per_member: number;
}
interface ChallengeRow {
  challenge_id: string;
  title: string;
  status: string;
  participants: number;
  completed: number;
  completion_rate: number;
}

const Engagement = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthly, setMonthly] = useState<MonthlyRow[]>([]);
  const [contributors, setContributors] = useState<ContributorRow[]>([]);
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [challenges, setChallenges] = useState<ChallengeRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const db = supabase as any;
      const [ov, mo, co, te, ch] = await Promise.all([
        db.rpc("org_engagement_overview"),
        db.rpc("org_engagement_monthly"),
        db.rpc("org_top_contributors", { _limit: 10 }),
        db.rpc("org_team_engagement"),
        db.rpc("org_challenge_engagement"),
      ]);
      if (cancelled) return;
      const firstError = [ov, mo, co, te, ch].find((r) => r.error)?.error;
      if (firstError) {
        setError(firstError.message ?? "error");
      } else {
        setError(null);
        setOverview((ov.data?.[0] as Overview) ?? null);
        setMonthly((mo.data as MonthlyRow[]) ?? []);
        setContributors((co.data as ContributorRow[]) ?? []);
        setTeams((te.data as TeamRow[]) ?? []);
        setChallenges((ch.data as ChallengeRow[]) ?? []);
      }
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const engagementRate =
    overview && overview.total_employees > 0
      ? Math.round((overview.engaged_employees_30d / overview.total_employees) * 100)
      : 0;

  const monthLabel = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: "short", year: "2-digit" });

  const chartData = monthly.map((m) => ({
    month: monthLabel(m.month),
    posts: Number(m.posts),
    comments: Number(m.comments),
    likes: Number(m.likes),
  }));

  const dateLabel = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString() : t("employerPanel.engagement.never");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">
          {t("employerPanel.engagement.title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("employerPanel.engagement.description")}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("employerPanel.engagement.errorTitle")}</AlertTitle>
          <AlertDescription>{t("employerPanel.engagement.errorBody")}</AlertDescription>
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
                  <MessageSquare className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.engagement.kpi.posts")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">{overview?.posts ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.engagement.kpi.last30Days")}: {overview?.posts_30d ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.engagement.kpi.comments")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">{overview?.comments ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.engagement.kpi.last30Days")}: {overview?.comments_30d ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Heart className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.engagement.kpi.likes")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">{overview?.likes ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.engagement.kpi.last30Days")}: {overview?.likes_30d ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.engagement.kpi.engagementRate")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-4xl font-bold text-brand-blue">{engagementRate}%</p>
                <Progress value={engagementRate} />
                <p className="text-xs text-muted-foreground">
                  {overview?.engaged_employees_30d ?? 0}/{overview?.total_employees ?? 0}{" "}
                  {t("employerPanel.engagement.kpi.last30Days")}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-muted-foreground">
                  {t("employerPanel.engagement.kpi.challengeParticipants")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-brand-blue">
                  {overview?.challenge_participants ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-muted-foreground">
                  {t("employerPanel.engagement.kpi.challengeCompletions")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-brand-blue">
                  {overview?.challenge_completions ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-muted-foreground">
                  {t("employerPanel.engagement.kpi.surveyRespondents")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-brand-blue">
                  {overview?.survey_respondents ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.engagement.monthlyTrend")}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="posts"
                    name={t("employerPanel.engagement.kpi.posts") as string}
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="comments"
                    name={t("employerPanel.engagement.kpi.comments") as string}
                    fill="hsl(var(--secondary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="likes"
                    name={t("employerPanel.engagement.kpi.likes") as string}
                    fill="hsl(var(--muted-foreground))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.engagement.teamInteraction")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("employerPanel.engagement.noTeams")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("employerPanel.engagement.table.team")}</TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.table.members")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.table.activeMembers")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.kpi.posts")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.kpi.comments")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.kpi.likes")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.table.perMember")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((row) => (
                      <TableRow key={row.team_id}>
                        <TableCell className="font-medium">{row.team_name}</TableCell>
                        <TableCell className="text-right">{row.members}</TableCell>
                        <TableCell className="text-right">{row.active_members}</TableCell>
                        <TableCell className="text-right">{row.posts}</TableCell>
                        <TableCell className="text-right">{row.comments}</TableCell>
                        <TableCell className="text-right">{row.likes}</TableCell>
                        <TableCell className="text-right">{row.engagement_per_member}</TableCell>
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
                <Heart className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.engagement.topContributors")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contributors.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("employerPanel.engagement.noData")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("employerPanel.engagement.table.employee")}</TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.kpi.posts")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.kpi.comments")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.kpi.likes")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.table.score")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.table.lastActivity")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributors.map((row) => (
                      <TableRow key={row.user_id}>
                        <TableCell className="font-medium">{row.display_name}</TableCell>
                        <TableCell className="text-right">{row.posts}</TableCell>
                        <TableCell className="text-right">{row.comments}</TableCell>
                        <TableCell className="text-right">{row.likes}</TableCell>
                        <TableCell className="text-right">{row.engagement_score}</TableCell>
                        <TableCell className="text-right">{dateLabel(row.last_activity)}</TableCell>
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
                <Trophy className="h-4 w-4 text-brand-purple" />
                {t("employerPanel.engagement.challengeParticipation")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {challenges.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("employerPanel.engagement.noChallenges")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("employerPanel.engagement.table.challenge")}</TableHead>
                      <TableHead>{t("employerPanel.engagement.table.status")}</TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.table.participants")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.table.completed")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.engagement.table.completionRate")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {challenges.map((row) => (
                      <TableRow key={row.challenge_id}>
                        <TableCell className="font-medium">{row.title}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell className="text-right">{row.participants}</TableCell>
                        <TableCell className="text-right">{row.completed}</TableCell>
                        <TableCell className="text-right">{row.completion_rate}%</TableCell>
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

export default Engagement;
