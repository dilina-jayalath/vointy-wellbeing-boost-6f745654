import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLog, useOpenSurveys } from "@/hooks/useAppData";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Activity as ActivityIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const localized = (value: any, lang: string) =>
  typeof value === "object" && value !== null ? value[lang] ?? value.en ?? "" : value ?? "";

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const AppActivityIndex = () => {
  const { user } = useAuth();
  const { language, t } = useTranslation();
  const qc = useQueryClient();
  const { data: log } = useActivityLog();
  const { data: surveys } = useOpenSurveys();
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);


  const survey = surveys?.[0];
  const questions = (survey?.survey_questions ?? []).sort((a: any, b: any) => a.position - b.position);

  // 1 point per performed activity. Monthly sums, and a running total for the
  // membership year that started when the user joined.
  const { thisMonth, yearTotal, chartData, yearLabel } = useMemo(() => {
    const joined = user?.created_at ? new Date(user.created_at) : new Date();
    const now = new Date();

    // Current membership year window (anniversary based)
    const yearStart = new Date(joined);
    while (yearStart <= now) yearStart.setFullYear(yearStart.getFullYear() + 1);
    yearStart.setFullYear(yearStart.getFullYear() - 1);

    const entries = (log ?? []).map((e: any) => new Date(e.performed_at));
    const inYear = entries.filter((d) => d >= yearStart && d <= now);

    const counts: Record<string, number> = {};
    inYear.forEach((d) => {
      const k = monthKey(d);
      counts[k] = (counts[k] ?? 0) + 1;
    });

    // Build the 12 months of the current membership year up to now
    const months: { month: string; points: number }[] = [];
    const cursor = new Date(yearStart.getFullYear(), yearStart.getMonth(), 1);
    while (cursor <= now) {
      const k = monthKey(cursor);
      months.push({
        month: cursor.toLocaleDateString(undefined, { month: "short" }),
        points: counts[k] ?? 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return {
      thisMonth: counts[monthKey(now)] ?? 0,
      yearTotal: inYear.length,
      chartData: months,
      yearLabel: `${yearStart.toLocaleDateString(undefined, { month: "short", year: "numeric" })} →`,
    };
  }, [log, user?.created_at]);

  const submit = async () => {
    if (!user || !survey) return;

    const missing = questions.filter((q: any) => {
      if (q.question_type === "scale") return false;
      const v = answers[q.id];
      return v === undefined || String(v).trim() === "";
    });
    if (missing.length > 0) {
      toast({
        title: t("appPanel.wellbeing.toast.couldNotSubmit"),
        description: t("appPanel.wellbeing.answerPlaceholder") as string,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("survey_answers").insert(
      questions.map((q: any) => {
        const answer = answers[q.id];
        const isScale = q.question_type === "scale";
        const base = {
          survey_id: survey.id,
          question_id: q.id,
          user_id: user.id,
        };
        return isScale
          ? { ...base, answer_value: Number(answer ?? 5) }
          : { ...base, answer_text: String(answer ?? "") };
      })
    );
    setSaving(false);
    if (error) {
      toast({ title: t("appPanel.wellbeing.toast.couldNotSubmit"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("appPanel.wellbeing.toast.thanksTitle"), description: t("appPanel.wellbeing.toast.thanksDesc") });
    setAnswers({});
    setSubmitted(true);
    await qc.invalidateQueries({ queryKey: ["open-surveys"] });
  };


  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ActivityIcon className="h-6 w-6 text-brand-purple" /> {t("appPanel.wellbeing.title")}
      </h1>

      <Card className="bg-gradient-to-br from-brand-purple to-brand-blue text-primary-foreground border-0">
        <CardContent className="p-6 text-center">
          <p className="text-5xl font-bold">{yearTotal}</p>
          <p className="text-sm opacity-90">{t("appPanel.wellbeing.pointsThisMembershipYear")}</p>
          <p className="text-xs opacity-75 mt-1">{(t("appPanel.wellbeing.pointsThisMonth") as string).replace("{n}", String(thisMonth))}</p>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        {t("appPanel.wellbeing.explanation")}
      </p>

      {chartData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{(t("appPanel.wellbeing.monthlyPoints") as string).replace("{year}", yearLabel)}</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" fontSize={11} />
                <YAxis allowDecimals={false} fontSize={11} width={28} />
                <Tooltip />
                <Bar dataKey="points" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {survey && questions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{localized(survey.title, language)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground">{localized(survey.description, language)}</p>
            {questions.map((q: any) => (
              <div key={q.id} className="space-y-2">
                <p className="text-sm font-medium">{localized(q.question, language)}</p>
                {q.question_type === "scale" ? (
                  <>
                    <Slider
                      value={[Number(answers[q.id] ?? 5)]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={([v]) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                    />
                    <p className="text-xs text-muted-foreground text-right">{answers[q.id] ?? 5} / 10</p>
                  </>
                ) : q.question_type === "text" ? (
                  <Textarea
                    value={String(answers[q.id] ?? "")}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder={t("appPanel.wellbeing.answerPlaceholder") as string}
                    rows={3}
                  />
                ) : q.question_type === "choice" && Array.isArray(q.options) ? (
                  <RadioGroup
                    value={String(answers[q.id] ?? "")}
                    onValueChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                    className="space-y-1"
                  >
                    {q.options.map((opt: string) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                        <Label htmlFor={`${q.id}-${opt}`} className="text-sm font-normal">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Textarea
                    value={String(answers[q.id] ?? "")}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder={t("appPanel.wellbeing.answerPlaceholder") as string}
                    rows={3}
                  />
                )}
              </div>
            ))}
            <Button className="w-full" onClick={submit} disabled={saving}>
              {saving ? t("appPanel.wellbeing.saving") : t("appPanel.wellbeing.submit")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppActivityIndex;
