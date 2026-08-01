import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Copy, Download, Loader2, Plus, Send, Trash2, Upload } from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  email: string;
}

interface Invitation {
  id: string;
  name: string | null;
  email: string;
  token: string;
  status: string;
  created_at: string;
}

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityId: string | null;
  activityTitle?: string;
}

export const ActivityInviteDialog = ({ open, onOpenChange, activityId, activityTitle }: Props) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [list, setList] = useState<Recipient[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!activityId) return;
    const { data } = await supabase
      .from("activity_invitations")
      .select("id, name, email, token, status, created_at")
      .eq("activity_id", activityId)
      .order("created_at", { ascending: false });
    setInvitations((data as Invitation[]) ?? []);
  }, [activityId]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const add = () => {
    if (!emailRe.test(email)) {
      toast({ title: t("appPanel.activityInvite.toast.invalidEmail"), variant: "destructive" });
      return;
    }
    setList((l) => [...l, { id: crypto.randomUUID(), name: name.trim(), email: email.trim() }]);
    setName("");
    setEmail("");
  };

  const downloadTemplate = () => {
    const csv = "email,givenName\njane@example.com,Jane\njohn@example.com,John\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vointy-activity-invite-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onUpload = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const rows = lines[0]?.toLowerCase().includes("email") ? lines.slice(1) : lines;
    const parsed: Recipient[] = [];
    for (const line of rows) {
      const [a, b] = line.split(",").map((s) => s.trim());
      const em = emailRe.test(a) ? a : emailRe.test(b ?? "") ? b : "";
      const nm = emailRe.test(a) ? b || "" : a || "";
      if (em) parsed.push({ id: crypto.randomUUID(), name: nm, email: em });
    }
    setList((l) => [...l, ...parsed]);
    toast({ title: t("appPanel.activityInvite.toast.csvImportedTitle"), description: (t("appPanel.activityInvite.toast.csvImportedDesc") as string).replace("{n}", String(parsed.length)) });
  };

  const inviteLink = (token: string) =>
    `${window.location.origin}/app/activities?invite=${token}`;

  const copyLink = async (token: string) => {
    await navigator.clipboard.writeText(inviteLink(token));
    toast({ title: t("appPanel.activityInvite.toast.linkCopied") });
  };

  const sendEmail = async (inv: Invitation) => {
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "employee-invitation",
          recipientEmail: inv.email,
          idempotencyKey: `activity-invitation-${inv.id}`,
          templateData: {
            name: inv.name ?? undefined,
            organizationName: activityTitle ?? undefined,
            joinUrl: inviteLink(inv.token),
          },
        },
      });
    } catch {
      /* link sharing still works */
    }
  };

  const sendAll = async () => {
    if (!user || !activityId || list.length === 0) return;
    setSending(true);
    const { data, error } = await supabase
      .from("activity_invitations")
      .upsert(
        list.map((r) => ({
          activity_id: activityId,
          invited_by: user.id,
          email: r.email,
          name: r.name || null,
        })),
        { onConflict: "activity_id,email" }
      )
      .select("id, name, email, token, status, created_at");

    if (error) {
      setSending(false);
      toast({ title: t("appPanel.activityInvite.toast.couldNotCreate"), description: error.message, variant: "destructive" });
      return;
    }
    const created = (data as Invitation[]) ?? [];
    for (const inv of created) await sendEmail(inv);
    setSending(false);
    toast({ title: t("appPanel.activityInvite.toast.sentTitle"), description: (t("appPanel.activityInvite.toast.sentDesc") as string).replace("{n}", String(created.length)) });
    setList([]);
    load();
  };

  const removeInvite = async (id: string) => {
    await supabase.from("activity_invitations").delete().eq("id", id);
    load();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{(t("appPanel.activityInvite.titlePrefix") as string).replace("{title}", activityTitle ?? "")}</DialogTitle>
          <DialogDescription>
            {t("appPanel.activityInvite.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <Label htmlFor="ai-name">{t("appPanel.activityInvite.name")}</Label>
              <Input id="ai-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ai-email">{t("appPanel.activityInvite.email")}</Label>
              <Input
                id="ai-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
              />
            </div>
            <Button onClick={add} className="h-10">
              <Plus className="h-4 w-4 mr-1" /> {t("appPanel.activityInvite.add")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            />
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1" /> {t("appPanel.activityInvite.uploadCsv")}
            </Button>
            <Button variant="ghost" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-1" /> {t("appPanel.activityInvite.template")}
            </Button>
          </div>

          {list.length > 0 && (
            <div className="rounded-md border divide-y">
              {list.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span>
                    <span className="font-medium">{r.name || "—"}</span>
                    <span className="text-muted-foreground ml-2">{r.email}</span>
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setList((l) => l.filter((x) => x.id !== r.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {list.length > 0 && (
            <Button onClick={sendAll} disabled={sending} className="w-full">
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" /> {list.length > 1 ? (t("appPanel.activityInvite.sendMany") as string).replace("{n}", String(list.length)) : t("appPanel.activityInvite.sendOne")}
                </>
              )}
            </Button>
          )}

          <div>
            <p className="text-sm font-medium mb-2">{t("appPanel.activityInvite.invitationsTitle")}</p>
            {invitations.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("appPanel.activityInvite.noInvitations")}</p>
            ) : (
              <div className="rounded-md border divide-y">
                {invitations.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{inv.name || "—"}</div>
                      <div className="text-muted-foreground truncate">{inv.email}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => copyLink(inv.token)} title={t("appPanel.activityInvite.copyLinkTitle")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => removeInvite(inv.id)} title={t("appPanel.activityInvite.removeTitle")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
