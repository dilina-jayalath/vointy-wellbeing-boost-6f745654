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

  const createTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setTeams((t) => [
      ...t,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        createdBy: "You",
        members: 0,
      },
    ]);
    setName("");
    setDescription("");
    setOpen(false);
    toast({ title: "Team created", description: `"${name}" has been added.` });
  };

  const removeTeam = (id: string) => setTeams((t) => t.filter((x) => x.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-brand-purple">Teams Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-purple hover:bg-brand-purple-dark uppercase">
              <Plus className="h-4 w-4 mr-1" /> Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new team</DialogTitle>
            </DialogHeader>
            <form onSubmit={createTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team name</Label>
                <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-desc">Description</Label>
                <Textarea id="team-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-brand-purple hover:bg-brand-purple-dark">Create</Button>
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
            <List className="h-4 w-4" /> Teams
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:text-brand-purple data-[state=active]:border-b-2 data-[state=active]:border-brand-purple rounded-none px-4 py-3 gap-2"
          >
            <Trophy className="h-4 w-4" /> Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-12 px-6 py-3 bg-muted/50 text-sm font-semibold">
                <div className="col-span-3">Team Name</div>
                <div className="col-span-4">Description</div>
                <div className="col-span-2">Created By</div>
                <div className="col-span-1">Members</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {teams.length === 0 ? (
                <div className="px-6 py-10 text-center text-muted-foreground">
                  No teams found. Create a new team to get started.
                </div>
              ) : (
                teams.map((t) => (
                  <div key={t.id} className="grid grid-cols-12 px-6 py-3 border-t items-center text-sm">
                    <div className="col-span-3 font-medium">{t.name}</div>
                    <div className="col-span-4 text-muted-foreground">{t.description || "—"}</div>
                    <div className="col-span-2">{t.createdBy}</div>
                    <div className="col-span-1">{t.members}</div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeTeam(t.id)}>
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
                <div className="col-span-1">#</div>
                <div className="col-span-5">Team</div>
                <div className="col-span-3">Members</div>
                <div className="col-span-3">Score</div>
              </div>
              <div className="px-6 py-10 text-center text-muted-foreground">
                No leaderboard data yet.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Teams;
