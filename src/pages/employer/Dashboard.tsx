import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, User, Star, BadgeCheck, TrendingUp, CheckCircle2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTranslation } from "@/lib/i18n";

const activityData = [
  { name: "Active", value: 82, color: "#86efac" },
  { name: "Inactive", value: 18, color: "#fca5a5" },
];

const progressData = [
  { name: "Steps", registered: 0.7, target: 1 },
  { name: "Water", registered: 0.5, target: 1 },
  { name: "Sleep", registered: 0.4, target: 1 },
  { name: "Workout", registered: 0.6, target: 1 },
];

const Dashboard = () => {
  const { t } = useTranslation();
  const planFeatureKeys = ["unlimitedUsers", "advancedAnalytics", "customChallenges"] as const;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-purple">{t("employerPanel.dashboard.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 text-brand-purple" /> {t("employerPanel.dashboard.userActivityStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-center mb-2">
              <p className="text-sm text-muted-foreground">{t("employerPanel.dashboard.totalUsers")}</p>
              <p className="text-4xl font-bold text-brand-blue">1</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 text-brand-purple" /> {t("employerPanel.dashboard.userActivityStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activityData} dataKey="value" innerRadius={0} outerRadius={60}>
                    {activityData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} iconType="square" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <Star className="h-4 w-4 text-brand-purple" /> {t("employerPanel.dashboard.employeeEngagement")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-4xl font-bold text-brand-blue text-center">82/100</p>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t("employerPanel.dashboard.challengeParticipation")}</span>
                <span>90%</span>
              </div>
              <Progress value={90} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t("employerPanel.dashboard.surveyResponseRate")}</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <BadgeCheck className="h-4 w-4 text-brand-purple" /> {t("employerPanel.dashboard.currentPlan")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-brand-purple/10 rounded-lg py-4 text-center">
              <p className="text-2xl font-bold text-brand-purple">{t("employerPanel.dashboard.free")}</p>
            </div>
            <div>
              <p className="text-sm mb-1">{t("employerPanel.dashboard.usage")}</p>
              <Progress value={100} />
              <p className="text-right text-xs text-muted-foreground mt-1">100%</p>
            </div>
            <ul className="text-sm space-y-1">
              {planFeatureKeys.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-purple" /> {t(`employerPanel.dashboard.planFeatures.${f}`)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-brand-purple" /> {t("employerPanel.dashboard.challengesProgress")}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="registered" name={t("employerPanel.dashboard.chart.registeredActivities")} fill="#c4b5fd" />
                <Bar dataKey="target" name={t("employerPanel.dashboard.chart.targetActivities")} fill="#93c5fd" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-brand-purple" /> {t("employerPanel.dashboard.activitiesInChallenges")}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center text-sm text-muted-foreground">
            {t("employerPanel.dashboard.noActivityData")}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
