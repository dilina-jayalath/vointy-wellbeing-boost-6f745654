import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/lib/i18n";
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
  const { t } = useTranslation();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    if (!user) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: t("appPanel.activityForm.toast.selectImage"), variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: t("appPanel.activityForm.toast.imageTooLarge"), variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("activity-images")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      setUploading(false);
      toast({ title: t("appPanel.activityForm.toast.uploadFailed"), description: error.message, variant: "destructive" });
      return;
    }
    const { data, error: signErr } = await supabase.storage
      .from("activity-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    setUploading(false);
    if (signErr || !data?.signedUrl) {
      toast({ title: t("appPanel.activityForm.toast.signFailed"), description: signErr?.message, variant: "destructive" });
      return;
    }
    setForm((f) => ({ ...f, image_url: data.signedUrl }));
    toast({ title: t("appPanel.activityForm.toast.imageUploaded") });
  };



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
      toast({ title: t("appPanel.activityForm.toast.titleRequired"), variant: "destructive" });
      return;
    }
    const duration = form.duration_minutes ? Number(form.duration_minutes) : null;
    if (duration !== null && (!Number.isFinite(duration) || duration <= 0)) {
      toast({ title: t("appPanel.activityForm.toast.invalidDuration"), variant: "destructive" });
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
      toast({ title: t("appPanel.activityForm.toast.couldNotSave"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: activity ? t("appPanel.activityForm.toast.updated") : t("appPanel.activityForm.toast.created") });
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{activity ? t("appPanel.activityForm.editTitle") : t("appPanel.activityForm.createTitle")}</DialogTitle>
          <DialogDescription>
            {t("appPanel.activityForm.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="ca-title">{t("appPanel.activityForm.titleLabel")}</Label>
            <Input
              id="ca-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              maxLength={120}
              placeholder={t("appPanel.activityForm.titlePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="ca-desc">{t("appPanel.activityForm.descLabel")}</Label>
            <Textarea
              id="ca-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder={t("appPanel.activityForm.descPlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="ca-duration">{t("appPanel.activityForm.durationLabel")}</Label>
            <Input
              id="ca-duration"
              type="number"
              min={1}
              value={form.duration_minutes}
              onChange={(e) => set("duration_minutes", e.target.value)}
              placeholder={t("appPanel.activityForm.durationPlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="ca-image">{t("appPanel.activityForm.imageLabel")}</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="ca-image"
                value={form.image_url}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder={t("appPanel.activityForm.imageUrlPlaceholder")}
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
                  {uploading ? t("appPanel.activityForm.uploading") : t("appPanel.activityForm.uploadImage")}
                </Button>
                <span className="text-xs text-muted-foreground">{t("appPanel.activityForm.orPasteUrl")}</span>
              </div>
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt={t("appPanel.activityForm.imagePreviewAlt")}
                  loading="lazy"
                  className="h-24 w-24 rounded-md object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="ca-link">{t("appPanel.activityForm.linkLabel")}</Label>
            <Input
              id="ca-link"
              value={form.link}
              onChange={(e) => set("link", e.target.value)}
              placeholder={t("appPanel.activityForm.linkPlaceholder")}
            />
          </div>
          <div>
            <Label>{t("appPanel.activityForm.visibilityLabel")}</Label>
            <Select value={form.visibility} onValueChange={(v) => set("visibility", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">{t("appPanel.activityForm.visibility.private")}</SelectItem>
                <SelectItem value="organization">{t("appPanel.activityForm.visibility.organization")}</SelectItem>
                <SelectItem value="public">{t("appPanel.activityForm.visibility.public")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("appPanel.activityForm.cancel")}
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? t("appPanel.activityForm.saving") : activity ? t("appPanel.activityForm.saveChanges") : t("appPanel.activityForm.createActivity")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
