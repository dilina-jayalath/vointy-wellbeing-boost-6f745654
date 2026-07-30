import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, Trophy, Activity as ActivityIcon, ClipboardList, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useWellbeingScores,
  usePerformedExercises,
  useChallenges,
  useOpenSurveys,
} from "@/hooks/useAppData";

const AppHome = () => {
  const { user, profile } = useAuth();
  const { data: scores } = useWellbeingScores();
  const { data: exercises } = usePerformedExercises();
  const { data: challenges } = useChallenges();
  const { data: surveys } = useOpenSurveys();

  const latestScore = scores?.length ? Number(scores[scores.length - 1].score) : null;

  const todayPoints = useMemo(() => {
    const today = new Date().toDateString();
    return (exercises ?? [])
      .filter((e: any) => new Date(e.performed_at).toDateString() === today)
      .reduce((sum: number, e: any) => sum + (e.points ?? 0), 0);
  }, [exercises]);

  const myChallenges = (challenges ?? []).filter((c: any) =>
    c.challenge_participants?.some((p: any) => p.user_id === user?.id)
  );
  const openChallenges = (challenges ?? []).filter(
    (c: any) => !c.challenge_participants?.some((p: any) => p.user_id === user?.id)
  );

  const greeting = profile?.display_name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="text-2xl font-bold">Hi, {greeting}</h1>
      </div>

      <Card className="bg-gradient-to-br from-brand-purple to-brand-blue text-primary-foreground border-0">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 flex items-center gap-1">
                <HeartPulse className="h-4 w-4" /> Wellbeing Index
              </p>
              <p className="text-4xl font-bold mt-1">{latestScore !== null ? Math.round(latestScore) : "—"}</p>
              <p className="text-xs opacity-80">out of 100</p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link to="/app/wellbeing">View</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <ActivityIcon className="h-5 w-5 text-brand-purple mb-2" />
            <p className="text-2xl font-bold">{todayPoints}</p>
            <p className="text-xs text-muted-foreground">Points today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Trophy className="h-5 w-5 text-brand-blue mb-2" />
            <p className="text-2xl font-bold">{myChallenges.length}</p>
            <p className="text-xs text-muted-foreground">Active challenges</p>
          </CardContent>
        </Card>
      </div>

      {(surveys?.length ?? 0) > 0 && (
        <Card className="border-brand-purple/40">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-brand-purple" /> Survey open
              </p>
              <p className="text-sm text-muted-foreground">Answer to update your wellbeing index.</p>
            </div>
            <Button asChild size="sm">
              <Link to="/app/wellbeing">Answer</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">My challenges</h2>
          <Link to="/app/challenges" className="text-sm text-brand-purple flex items-center">
            All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {myChallenges.length === 0 && (
          <p className="text-sm text-muted-foreground">You haven't joined any challenge yet.</p>
        )}
        {myChallenges.slice(0, 3).map((c: any) => {
          const mine = c.challenge_participants.find((p: any) => p.user_id === user?.id);
          const pct = c.target_value ? Math.min(100, (Number(mine?.progress ?? 0) / Number(c.target_value)) * 100) : 0;
          return (
            <Card key={c.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{c.title}</p>
                  <Badge variant="secondary">{c.challenge_type}</Badge>
                </div>
                <Progress value={pct} />
                <p className="text-xs text-muted-foreground">
                  {Number(mine?.progress ?? 0)} / {c.target_value ?? "—"} {c.unit ?? ""}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {openChallenges.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold">Open invitations</h2>
          {openChallenges.slice(0, 3).map((c: any) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/app/challenges">Join</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(exercises ?? []).slice(0, 5).map((e: any) => (
            <div key={e.id} className="flex items-center justify-between text-sm">
              <span>{e.activities?.title ?? "Activity"}</span>
              <span className="text-muted-foreground">
                {Number(e.amount)} {e.unit ?? e.activities?.unit ?? ""}
              </span>
            </div>
          ))}
          {(exercises?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">No logged activities yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppHome;
