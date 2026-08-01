import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useChallenges } from "@/hooks/useAppData";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Trophy, Medal } from "lucide-react";

const ChallengeCard = ({ challenge, userId, onJoin, t }: any) => {
  const mine = challenge.challenge_participants?.find((p: any) => p.user_id === userId);
  const pct = challenge.target_value
    ? Math.min(100, (Number(mine?.progress ?? 0) / Number(challenge.target_value)) * 100)
    : 0;
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{challenge.title}</p>
            <p className="text-xs text-muted-foreground">{challenge.description}</p>
          </div>
          <Badge variant="secondary">{challenge.challenge_type}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {challenge.challenge_participants?.length ?? 0} {t("appPanel.challenges.participants")}
          {challenge.end_date && ` · ${(t("appPanel.challenges.endsOn") as string).replace("{date}", new Date(challenge.end_date).toLocaleDateString())}`}
        </p>
        {mine ? (
          <>
            <Progress value={pct} />
            <p className="text-xs text-muted-foreground">
              {Number(mine.progress)} / {challenge.target_value ?? "—"} {challenge.unit ?? ""}
            </p>
          </>
        ) : (
          <Button size="sm" className="w-full" onClick={() => onJoin(challenge.id)}>
            {t("appPanel.challenges.joinChallenge")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const AppChallenges = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: challenges, isLoading } = useChallenges();

  const join = async (challengeId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("challenge_participants")
      .insert({ challenge_id: challengeId, user_id: user.id });
    if (error) {
      toast({ title: t("appPanel.challenges.toast.couldNotJoin"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("appPanel.challenges.toast.joined") });
    qc.invalidateQueries({ queryKey: ["challenges"] });
  };

  const all = challenges ?? [];
  const mine = all.filter((c: any) => c.challenge_participants?.some((p: any) => p.user_id === user?.id));
  const open = all.filter((c: any) => !c.challenge_participants?.some((p: any) => p.user_id === user?.id));

  const leaderboard = [...all]
    .flatMap((c: any) => c.challenge_participants ?? [])
    .reduce((acc: Record<string, number>, p: any) => {
      acc[p.user_id] = (acc[p.user_id] ?? 0) + Number(p.progress ?? 0);
      return acc;
    }, {});
  const ranked = (Object.entries(leaderboard) as [string, number][])
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Trophy className="h-6 w-6 text-brand-purple" /> {t("appPanel.challenges.title")}
      </h1>

      <Tabs defaultValue="mine">
        <TabsList className="w-full">
          <TabsTrigger value="mine" className="flex-1">{t("appPanel.challenges.tabs.mine")}</TabsTrigger>
          <TabsTrigger value="open" className="flex-1">{t("appPanel.challenges.tabs.open")}</TabsTrigger>
          <TabsTrigger value="board" className="flex-1">{t("appPanel.challenges.tabs.board")}</TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="space-y-3 mt-4">
          {isLoading && <p className="text-sm text-muted-foreground">{t("appPanel.challenges.loading")}</p>}
          {!isLoading && mine.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("appPanel.challenges.noneJoined")}</p>
          )}
          {mine.map((c: any) => (
            <ChallengeCard key={c.id} challenge={c} userId={user?.id} onJoin={join} t={t} />
          ))}
        </TabsContent>

        <TabsContent value="open" className="space-y-3 mt-4">
          {!isLoading && open.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("appPanel.challenges.noneOpen")}</p>
          )}
          {open.map((c: any) => (
            <ChallengeCard key={c.id} challenge={c} userId={user?.id} onJoin={join} t={t} />
          ))}
        </TabsContent>

        <TabsContent value="board" className="space-y-2 mt-4">
          {ranked.length === 0 && <p className="text-sm text-muted-foreground">{t("appPanel.challenges.noResults")}</p>}
          {ranked.map(([uid, total], i) => (
            <Card key={uid}>
              <CardContent className="p-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <Medal className={`h-4 w-4 ${i < 3 ? "text-brand-purple" : "text-muted-foreground"}`} />
                  {uid === user?.id ? t("appPanel.challenges.you") : (t("appPanel.challenges.member") as string).replace("{n}", String(i + 1))}
                </span>
                <span className="font-medium">{Math.round(total)}</span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppChallenges;
