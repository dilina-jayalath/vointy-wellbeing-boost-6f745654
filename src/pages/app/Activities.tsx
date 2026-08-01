import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useActivities, usePerformedExercises } from "@/hooks/useAppData";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, PlayCircle } from "lucide-react";
import { MyActivities } from "@/components/app/MyActivities";

const youTubeId = (url?: string | null) => {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
};

const AppActivities = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: activities, isLoading } = useActivities();
  const { data: history } = usePerformedExercises();
  const [selected, setSelected] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const log = async () => {
    if (!user || !selected) return;
    const value = Number(amount);
    if (!value || value <= 0) {
      toast({ title: t("appPanel.activities.toast.enterAmount"), variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("performed_exercises").insert({
      user_id: user.id,
      activity_id: selected.id,
      amount: value,
      unit: selected.unit,
      points: selected.points,
      note: note || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: t("appPanel.activities.toast.couldNotSave"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("appPanel.activities.toast.logged"), description: `${selected.title}: ${value} ${selected.unit}` });
    setSelected(null);
    setAmount("");
    setNote("");
    qc.invalidateQueries({ queryKey: ["performed-exercises"] });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("appPanel.activities.title")}</h1>

      <Tabs defaultValue="all">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">{t("appPanel.activities.tabs.all")}</TabsTrigger>
          <TabsTrigger value="mine" className="flex-1">{t("appPanel.activities.tabs.mine")}</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">{t("appPanel.activities.tabs.history")}</TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="mt-4">
          <MyActivities />
        </TabsContent>


        <TabsContent value="all" className="space-y-3 mt-4">
          {isLoading && <p className="text-sm text-muted-foreground">{t("appPanel.activities.loading")}</p>}
          {!isLoading && (activities?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("appPanel.activities.noActivities")}
            </p>
          )}
          {(activities ?? []).map((a: any) => (
            <Card key={a.id} className="overflow-hidden">
              <CardContent className="p-4 flex items-center gap-3">
                {a.image_url && (
                  <img
                    src={a.image_url}
                    alt={a.title}
                    loading="lazy"
                    className="h-16 w-16 rounded-md object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
                  <p className="text-xs text-brand-purple mt-1">
                    {a.points} pts · {a.unit}
                    {a.category ? ` · ${a.category}` : ""}
                  </p>
                  {a.link && (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <PlayCircle className="h-3.5 w-3.5" />
                      {youTubeId(a.link) ? t("appPanel.activities.video") : t("appPanel.activities.guide")}
                    </span>
                  )}
                </div>
                <Button size="sm" onClick={() => setSelected(a)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-3 mt-4">
          {(history ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">{t("appPanel.activities.nothingLogged")}</p>
          )}
          {(history ?? []).map((e: any) => (
            <Card key={e.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{e.activities?.title ?? t("appPanel.activities.activityFallback")}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(e.performed_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{Number(e.amount)} {e.unit ?? ""}</p>
                  <p className="text-xs text-brand-purple">+{e.points} pts</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {youTubeId(selected?.link) ? (
              <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${youTubeId(selected?.link)}`}
                  title={selected?.title ?? "Activity video"}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : selected?.link ? (
              <a
                href={selected.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline text-muted-foreground"
              >
                {t("appPanel.activities.openGuide")}
              </a>
            ) : null}
            {selected?.description && (
              <p className="text-sm text-muted-foreground">{selected.description}</p>
            )}
            <div>
              <Label htmlFor="amount">{(t("appPanel.activities.amount") as string).replace("{unit}", selected?.unit ?? "")}</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t("appPanel.activities.amountPlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="note">{t("appPanel.activities.note")}</Label>
              <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={log} disabled={saving}>
              {saving ? t("appPanel.activities.saving") : t("appPanel.activities.logActivity")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppActivities;
