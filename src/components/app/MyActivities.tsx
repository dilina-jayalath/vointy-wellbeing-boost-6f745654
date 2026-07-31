import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Pencil, Plus, Trash2, UserPlus, Clock, PlayCircle } from "lucide-react";
import { ActivityForm, type CustomActivity } from "./ActivityForm";
import { ActivityInviteDialog } from "./ActivityInviteDialog";

const visibilityLabel: Record<string, string> = {
  private: "Only me",
  organization: "My company",
  public: "Everyone",
};

export const MyActivities = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [items, setItems] = useState<CustomActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CustomActivity | null>(null);
  const [inviteFor, setInviteFor] = useState<CustomActivity | null>(null);
  const [deleting, setDeleting] = useState<CustomActivity | null>(null);
  const [preview, setPreview] = useState<CustomActivity | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("activities")
      .select("id, title, description, duration_minutes, image_url, link, visibility")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: "Could not load your activities", description: error.message, variant: "destructive" });
      return;
    }
    setItems((data as CustomActivity[]) ?? []);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const afterSave = () => {
    load();
    qc.invalidateQueries({ queryKey: ["activities"] });
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const { error } = await supabase.from("activities").delete().eq("id", deleting.id);
    setDeleting(null);
    if (error) {
      toast({ title: "Could not delete", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Activity deleted" });
    afterSave();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Create your own activities and invite others to join them.
        </p>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> New activity
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You have not created any activities yet.
        </p>
      )}

      {items.map((a) => (
        <Card key={a.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              {a.image_url && (
                <button
                  type="button"
                  onClick={() => setPreview(a)}
                  className="flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={`Show larger image of ${a.title}`}
                >
                  <img
                    src={a.image_url}
                    alt={a.title}
                    loading="lazy"
                    className="h-16 w-16 rounded-md object-cover transition-transform hover:scale-105"
                  />
                </button>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-medium">{a.title}</p>
                {a.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {a.duration_minutes ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {a.duration_minutes} min
                    </span>
                  ) : null}
                  {a.link ? (
                    <span className="inline-flex items-center gap-1">
                      <PlayCircle className="h-3.5 w-3.5" /> Video
                    </span>
                  ) : null}
                  <span>{visibilityLabel[a.visibility] ?? a.visibility}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setInviteFor(a)}>
                <UserPlus className="h-4 w-4 mr-1" /> Invite
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(a);
                  setFormOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDeleting(a)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <ActivityForm
        open={formOpen}
        onOpenChange={setFormOpen}
        activity={editing}
        onSaved={afterSave}
      />

      <ActivityInviteDialog
        open={!!inviteFor}
        onOpenChange={(o) => !o && setInviteFor(null)}
        activityId={inviteFor?.id ?? null}
        activityTitle={inviteFor?.title}
      />

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
          </DialogHeader>
          {preview?.image_url && (
            <img
              src={preview.image_url}
              alt={preview.title}
              className="max-h-[75vh] w-full rounded-md object-contain"
            />
          )}
        </DialogContent>
      </Dialog>



      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this activity?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.title}” and its invitations will be removed permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
