import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export interface CustomActivity {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  image_url: string | null;
  link: string | null;
  visibility: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity?: CustomActivity | null;
  onSaved: () => void;
}

const empty = {
  title: "",
  description: "",
  duration_minutes: "",
  image_url: "",
  link: "",
  visibility: "organization",
};

export const ActivityForm = ({ open, onOpenChange, activity, onSaved }: Props) => {
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      activity
        ? {
            title: activity.title ?? "",
            description: activity.description ?? "",
            duration_minutes: activity.duration_minutes ? String(activity.duration_minutes) : "",
            image_url: activity.image_url ?? "",
            link: activity.link ?? "",
            visibility: activity.visibility ?? "organization",
          }
        : empty
    );
  }, [open, activity]);

  const set = (key: keyof typeof empty, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    if (!user) return;
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    const duration = form.duration_minutes ? Number(form.duration_minutes) : null;
    if (duration !== null && (!Number.isFinite(duration) || duration <= 0)) {
      toast({ title: "Enter a valid duration in minutes", variant: "destructive" });
      return;
    }
    setSaving(true);

    let organizationId: string | null = null;
    if (form.visibility === "organization") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("user_id", user.id)
        .maybeSingle();
      organizationId = profile?.organization_id ?? null;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      duration_minutes: duration,
      image_url: form.image_url.trim() || null,
      link: form.link.trim() || null,
      visibility: organizationId || form.visibility !== "organization" ? form.visibility : "private",
      organization_id: organizationId,
      unit: "minutes",
      points: 1,
      is_active: true,
      created_by: user.id,
    };

    const { error } = activity
      ? await supabase.from("activities").update(payload).eq("id", activity.id)
      : await supabase.from("activities").insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: "Could not save activity", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: activity ? "Activity updated" : "Activity created" });
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{activity ? "Edit activity" : "Create activity"}</DialogTitle>
          <DialogDescription>
            Add your own activity with a description, duration and an image or YouTube video.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="ca-title">Title</Label>
            <Input
              id="ca-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              maxLength={120}
              placeholder="Morning mobility routine"
            />
          </div>
          <div>
            <Label htmlFor="ca-desc">Description</Label>
            <Textarea
              id="ca-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="What is done, how and why?"
            />
          </div>
          <div>
            <Label htmlFor="ca-duration">Duration (minutes)</Label>
            <Input
              id="ca-duration"
              type="number"
              min={1}
              value={form.duration_minutes}
              onChange={(e) => set("duration_minutes", e.target.value)}
              placeholder="30"
            />
          </div>
          <div>
            <Label htmlFor="ca-image">Image</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="ca-image"
                value={form.image_url}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder="https://…/photo.jpg"
              />
              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) uploadImage(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {uploading ? "Uploading…" : "Upload image"}
                </Button>
                <span className="text-xs text-muted-foreground">or paste a URL above</span>
              </div>
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="Activity preview"
                  loading="lazy"
                  className="h-24 w-24 rounded-md object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="ca-link">YouTube video link</Label>
            <Input
              id="ca-link"
              value={form.link}
              onChange={(e) => set("link", e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
            />
          </div>
          <div>
            <Label>Visibility</Label>
            <Select value={form.visibility} onValueChange={(v) => set("visibility", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Only me</SelectItem>
                <SelectItem value="organization">My company</SelectItem>
                <SelectItem value="public">Everyone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : activity ? "Save changes" : "Create activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
