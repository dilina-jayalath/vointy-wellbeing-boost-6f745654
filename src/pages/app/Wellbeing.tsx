import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useWellbeingScores, useOpenSurveys } from "@/hooks/useAppData";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { HeartPulse } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const localized = (value: any, lang: string) =>
  typeof value === "object" && value !== null ? value[lang] ?? value.en ?? "" : value ?? "";

const AppWellbeing = () => {
  const { user, profile } = useAuth();
  const { language } = useTranslation();
  const qc = useQueryClient();
  const { data: scores } = useWellbeingScores();
  const { data: surveys } = useOpenSurveys();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const survey = surveys?.[0];
  const questions = (survey?.survey_questions ?? []).sort((a: any, b: any) => a.position - b.position);
  const latest = scores?.length ? Number(scores[scores.length - 1].score) : null;

  const chartData = (scores ?? []).map((s: any) => ({
    date: new Date(s.recorded_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: Number(s.score),
  }));

  const submit = async () => {
    if (!user || !survey) return;
    const values = questions.map((q: any) => answers[q.id] ?? 5);
    setSaving(true);
    const { error: answerError } = await supabase.from("survey_answers").insert(
      questions.map((q: any) => ({
        survey_id: survey.id,
        question_id: q.id,
        user_id: user.id,
        answer_value: answers[q.id] ?? 5,
      }))
    );
    if (answerError) {
      setSaving(false);
      toast({ title: "Could not submit", description: answerError.message, variant: "destructive" });
      return;
    }
    const score = values.length ? (values.reduce((a, b) => a + b, 0) / values.length) * 10 : 0;
    const { error } = await supabase.from("wellbeing_index_scores").insert({
      user_id: user.id,
      organization_id: (profile as any)?.organization_id ?? null,
      survey_id: survey.id,
      score,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Could not save score", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Thanks!", description: `Your wellbeing index is now ${Math.round(score)}.` });
    setAnswers({});
    qc.invalidateQueries({ queryKey: ["wellbeing-scores"] });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <HeartPulse className="h-6 w-6 text-brand-purple" /> Wellbeing Index
      </h1>

      <Card className="bg-gradient-to-br from-brand-purple to-brand-blue text-primary-foreground border-0">
        <CardContent className="p-6 text-center">
          <p className="text-5xl font-bold">{latest !== null ? Math.round(latest) : "—"}</p>
          <p className="text-sm opacity-90">out of 100</p>
        </CardContent>
      </Card>

      {chartData.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" fontSize={11} />
                <YAxis domain={[0, 100]} fontSize={11} width={28} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#9b87f5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {survey ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{localized(survey.title, language)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground">{localized(survey.description, language)}</p>
            {questions.length === 0 && (
              <p className="text-sm text-muted-foreground">This survey has no questions yet.</p>
            )}
            {questions.map((q: any) => (
              <div key={q.id} className="space-y-2">
                <p className="text-sm font-medium">{localized(q.question, language)}</p>
                <Slider
                  value={[answers[q.id] ?? 5]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={([v]) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                />
                <p className="text-xs text-muted-foreground text-right">{answers[q.id] ?? 5} / 10</p>
              </div>
            ))}
            {questions.length > 0 && (
              <Button className="w-full" onClick={submit} disabled={saving}>
                {saving ? "Saving…" : "Submit"}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">
          No active survey right now. Your index updates when your employer opens a new survey.
        </p>
      )}
    </div>
  );
};

export default AppWellbeing;
