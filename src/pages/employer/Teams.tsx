import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { List, Trophy, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

interface Team {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: number;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  const createTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setTeams((t2) => [
      ...t2,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        createdBy: t("employerPanel.teams.createdByYou") as string,
        members: 0,
      },
    ]);
    setName("");
    setDescription("");
    setOpen(false);
    toast({
      title: t("employerPanel.teams.createdToastTitle") as string,
      description: (t("employerPanel.teams.createdToastDescription") as string).replace("{name}", name),
    });
  };

  const removeTeam = (id: string) => setTeams((t2) => t2.filter((x) => x.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-brand-purple">{t("employerPanel.teams.title")}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-purple hover:bg-brand-purple-dark uppercase">
              <Plus className="h-4 w-4 mr-1" /> {t("employerPanel.teams.createTeam")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("employerPanel.teams.createDialogTitle")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={createTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">{t("employerPanel.teams.teamName")}</Label>
                <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-desc">{t("employerPanel.teams.description")}</Label>
                <Textarea id="team-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-brand-purple hover:bg-brand-purple-dark">{t("employerPanel.teams.create")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="teams">
        <TabsList className="bg-transparent border-b w-full justify-start rounded-none p-0 h-auto">
          <TabsTrigger
            value="teams"
            className="data-[state=active]:text-brand-purple data-[state=active]:border-b-2 data-[state=active]:border-brand-purple rounded-none px-4 py-3 gap-2"
          >
            <List className="h-4 w-4" /> {t("employerPanel.teams.tabs.teams")}
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:text-brand-purple data-[state=active]:border-b-2 data-[state=active]:border-brand-purple rounded-none px-4 py-3 gap-2"
          >
            <Trophy className="h-4 w-4" /> {t("employerPanel.teams.tabs.leaderboard")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-12 px-6 py-3 bg-muted/50 text-sm font-semibold">
                <div className="col-span-3">{t("employerPanel.teams.columns.teamName")}</div>
                <div className="col-span-4">{t("employerPanel.teams.columns.description")}</div>
                <div className="col-span-2">{t("employerPanel.teams.columns.createdBy")}</div>
                <div className="col-span-1">{t("employerPanel.teams.columns.members")}</div>
                <div className="col-span-2 text-right">{t("employerPanel.teams.columns.actions")}</div>
              </div>
              {teams.length === 0 ? (
                <div className="px-6 py-10 text-center text-muted-foreground">
                  {t("employerPanel.teams.noTeams")}
                </div>
              ) : (
                teams.map((t2) => (
                  <div key={t2.id} className="grid grid-cols-12 px-6 py-3 border-t items-center text-sm">
                    <div className="col-span-3 font-medium">{t2.name}</div>
                    <div className="col-span-4 text-muted-foreground">{t2.description || "—"}</div>
                    <div className="col-span-2">{t2.createdBy}</div>
                    <div className="col-span-1">{t2.members}</div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeTeam(t2.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-12 px-6 py-3 bg-muted/50 text-sm font-semibold">
                <div className="col-span-1">{t("employerPanel.teams.leaderboardColumns.rank")}</div>
                <div className="col-span-5">{t("employerPanel.teams.leaderboardColumns.team")}</div>
                <div className="col-span-3">{t("employerPanel.teams.leaderboardColumns.members")}</div>
                <div className="col-span-3">{t("employerPanel.teams.leaderboardColumns.score")}</div>
              </div>
              <div className="px-6 py-10 text-center text-muted-foreground">
                {t("employerPanel.teams.noLeaderboard")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Teams;
