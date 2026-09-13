import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Trash2, Loader2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";
import { useTranslation } from "@/lib/i18n";

interface TeamRow {
  id: string;
  name: string;
  description: string | null;
  members: number;
}

const CompanyTeams = () => {
  const { user } = useAuth();
  const { orgId, loading: orgLoading } = useEmployerOrg();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    const { data } = await supabase
      .from("teams")
      .select("id, name, description, team_members(count)")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });
    setTeams(
      (data ?? []).map((row) => {
        const r = row as unknown as {
          id: string;
          name: string;
          description: string | null;
          team_members: { count: number }[] | null;
        };
        return {
          id: r.id,
          name: r.name,
          description: r.description,
          members: r.team_members?.[0]?.count ?? 0,
        };
      })
    );
    setLoading(false);
  }, [orgId]);

  useEffect(() => {
    load();
  }, [load]);

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !orgId || !user) return;
    setSaving(true);
    const { error } = await supabase.from("teams").insert({
      organization_id: orgId,
      name: name.trim(),
      description: description.trim() || null,
      created_by: user.id,
    });
    setSaving(false);
    if (error) {
      toast({ title: t("companyWorkspace.teams.createFailed") as string, description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: t("employerPanel.teams.createdToastTitle") as string,
      description: (t("employerPanel.teams.createdToastDescription") as string).replace("{name}", name.trim()),
    });
    setName("");
    setDescription("");
    setOpen(false);
    load();
  };

  const removeTeam = async (id: string) => {
    await supabase.from("teams").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-brand-purple">{t("companyWorkspace.teams.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("companyWorkspace.teams.subtitle")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-purple hover:bg-brand-purple-dark">
              <Plus className="h-4 w-4 mr-1" /> {t("employerPanel.teams.createTeam")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={createTeam}>
              <DialogHeader>
                <DialogTitle>{t("employerPanel.teams.createDialogTitle")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">{t("employerPanel.teams.teamName")}</Label>
                  <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-desc">{t("employerPanel.teams.description")}</Label>
                  <Textarea id="team-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving} className="bg-brand-purple hover:bg-brand-purple-dark">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("employerPanel.teams.create")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("employerPanel.teams.tabs.teams")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading || orgLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-brand-purple" />
            </div>
          ) : teams.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("employerPanel.teams.noTeams")}</p>
          ) : (
            <div className="border rounded-md divide-y">
              {teams.map((team) => (
                <div key={team.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{team.name}</div>
                    {team.description && (
                      <div className="text-sm text-muted-foreground truncate">{team.description}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" /> {team.members}
                    </span>
                    <Button size="icon" variant="ghost" onClick={() => removeTeam(team.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyTeams;
