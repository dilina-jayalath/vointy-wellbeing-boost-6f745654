import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gauge } from "lucide-react";

type OrgIndex = {
  employees_with_data: number;
  avg_index: number;
  avg_consistency: number;
  avg_variety: number;
  avg_community: number;
  avg_wellbeing: number;
  high_index_share: number;
  low_index_share: number;
};

const OrgIndexCard = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<OrgIndex | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: rows } = await (supabase as any).rpc("org_wellbeing_index");
      if (!cancelled) setData((rows?.[0] as OrgIndex) ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const parts = [
    { label: t("employerPanel.qualityIndex.consistency") as string, value: Number(data?.avg_consistency ?? 0), max: 40 },
    { label: t("employerPanel.qualityIndex.variety") as string, value: Number(data?.avg_variety ?? 0), max: 20 },
    { label: t("employerPanel.qualityIndex.community") as string, value: Number(data?.avg_community ?? 0), max: 20 },
    { label: t("employerPanel.qualityIndex.wellbeing") as string, value: Number(data?.avg_wellbeing ?? 0), max: 20 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
          <Gauge className="h-4 w-4 text-brand-purple" />
          {t("employerPanel.qualityIndex.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <p className="text-4xl font-bold text-brand-blue">{Number(data?.avg_index ?? 0)}</p>
          <p className="text-sm text-muted-foreground mb-1">/ 100</p>
        </div>
        <Progress value={Number(data?.avg_index ?? 0)} />
        <p className="text-xs text-muted-foreground">{t("employerPanel.qualityIndex.description")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {parts.map((p) => (
            <div key={p.label}>
              <div className="flex items-center justify-between text-sm">
                <span>{p.label}</span>
                <span className="text-muted-foreground">
                  {p.value} / {p.max}
                </span>
              </div>
              <Progress value={(p.value / p.max) * 100} className="h-1.5 mt-1" />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>
            {(t("employerPanel.qualityIndex.highShare") as string).replace(
              "{n}",
              String(Number(data?.high_index_share ?? 0))
            )}
          </span>
          <span>
            {(t("employerPanel.qualityIndex.lowShare") as string).replace(
              "{n}",
              String(Number(data?.low_index_share ?? 0))
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrgIndexCard;
