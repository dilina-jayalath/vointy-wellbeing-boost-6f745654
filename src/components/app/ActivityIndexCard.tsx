import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gauge } from "lucide-react";

type IndexRow = {
  index_score: number;
  consistency: number;
  variety: number;
  community: number;
  wellbeing: number;
  active_days_30d: number;
  categories_30d: number;
  community_events_30d: number;
  survey_avg: number | null;
};

const useActivityIndex = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["activity-index", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<IndexRow | null> => {
      const { data, error } = await (supabase as any).rpc("user_activity_index");
      if (error) throw error;
      return (data?.[0] as IndexRow) ?? null;
    },
  });
};

const ActivityIndexCard = () => {
  const { t } = useTranslation();
  const { data } = useActivityIndex();

  const score = Number(data?.index_score ?? 0);
  const parts = [
    { label: t("appPanel.index.consistency") as string, value: Number(data?.consistency ?? 0), max: 40,
      hint: (t("appPanel.index.activeDays") as string).replace("{n}", String(data?.active_days_30d ?? 0)) },
    { label: t("appPanel.index.variety") as string, value: Number(data?.variety ?? 0), max: 20,
      hint: (t("appPanel.index.categories") as string).replace("{n}", String(data?.categories_30d ?? 0)) },
    { label: t("appPanel.index.community") as string, value: Number(data?.community ?? 0), max: 20,
      hint: (t("appPanel.index.socialEvents") as string).replace("{n}", String(data?.community_events_30d ?? 0)) },
    { label: t("appPanel.index.wellbeing") as string, value: Number(data?.wellbeing ?? 0), max: 20,
      hint: data?.survey_avg
        ? (t("appPanel.index.surveyAvg") as string).replace("{n}", String(data.survey_avg))
        : (t("appPanel.index.noSurvey") as string) },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Gauge className="h-4 w-4 text-brand-purple" />
          {t("appPanel.index.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <p className="text-4xl font-bold text-brand-purple">{score}</p>
          <p className="text-sm text-muted-foreground mb-1">/ 100</p>
        </div>
        <Progress value={score} />
        <p className="text-xs text-muted-foreground">{t("appPanel.index.description")}</p>
        <div className="space-y-3">
          {parts.map((p) => (
            <div key={p.label}>
              <div className="flex items-center justify-between text-sm">
                <span>{p.label}</span>
                <span className="text-muted-foreground">
                  {p.value} / {p.max}
                </span>
              </div>
              <Progress value={(p.value / p.max) * 100} className="h-1.5 mt-1" />
              <p className="text-xs text-muted-foreground mt-1">{p.hint}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityIndexCard;
