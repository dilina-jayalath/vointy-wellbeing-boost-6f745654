import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Download, Info, Trash2, User, Mail, Copy, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";

interface Recipient { id: string; name: string; email: string; }

interface Invitation {
  id: string;
  name: string | null;
  email: string;
  token: string;
  status: string;
  created_at: string;
}

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const InviteUsers = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [list, setList] = useState<Recipient[]>([]);
  const [sending, setSending] = useState(false);
  const [resending, setResending] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { orgId, orgName, loading: orgLoading } = useEmployerOrg();

  const loadInvitations = useCallback(async () => {
    if (!orgId) return;
    const { data } = await supabase
      .from("organization_invitations")
      .select("id, name, email, token, status, created_at")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });
    setInvitations((data as Invitation[]) ?? []);
  }, [orgId]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const add = () => {
    if (!name.trim() || !emailRe.test(email)) {
      toast({ title: "Invalid entry", description: "Please enter a valid name and email.", variant: "destructive" });
      return;
    }
    setList((l) => [...l, { id: crypto.randomUUID(), name: name.trim(), email: email.trim() }]);
    setName("");
    setEmail("");
  };

  const remove = (id: string) => setList((l) => l.filter((x) => x.id !== id));

  const downloadTemplate = () => {
    const csv = "email,givenName\njane@example.com,Jane\njohn@example.com,John\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vointy-invite-template.csv";
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
      const em = emailRe.test(a) ? a : emailRe.test(b) ? b : "";
      const nm = emailRe.test(a) ? b || "" : a || "";
      if (em) parsed.push({ id: crypto.randomUUID(), name: nm, email: em });
    }
    setList((l) => [...l, ...parsed]);
    toast({ title: "CSV imported", description: `${parsed.length} recipient(s) added.` });
  };

  const inviteLink = (token: string) => `${window.location.origin}/join?token=${token}`;

  const copyLink = async (token: string) => {
    await navigator.clipboard.writeText(inviteLink(token));
    toast({ title: "Invitation link copied" });
  };

  const cancelInvite = async (id: string) => {
    await supabase.from("organization_invitations").delete().eq("id", id);
    loadInvitations();
  };

  const sendInviteEmail = async (inv: Invitation) => {
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "employee-invitation",
        recipientEmail: inv.email,
        idempotencyKey: `employee-invitation-${inv.id}`,
        templateData: {
          name: inv.name ?? undefined,
          organizationName: orgName ?? undefined,
          joinUrl: inviteLink(inv.token),
        },
      },
    });
  };

  const resendInvite = async (inv: Invitation) => {
    setResending(inv.id);
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "employee-invitation",
          recipientEmail: inv.email,
          idempotencyKey: `employee-invitation-${inv.id}-${Date.now()}`,
          templateData: {
            name: inv.name ?? undefined,
            organizationName: orgName ?? undefined,
            joinUrl: inviteLink(inv.token),
          },
        },
      });
      toast({ title: "Invitation email sent", description: inv.email });
    } catch (e) {
      toast({ title: "Could not send email", variant: "destructive" });
    } finally {
      setResending(null);
    }
  };

  const sendAll = async () => {
    if (!orgId || !user) return;
    setSending(true);
    const { data, error } = await supabase
      .from("organization_invitations")
      .insert(
        list.map((r) => ({
          organization_id: orgId,
          invited_by: user.id,
          email: r.email,
          name: r.name,
        }))
      )
      .select("id, name, email, token, status, created_at");
    if (error) {
      setSending(false);
      toast({ title: "Could not create invitations", description: error.message, variant: "destructive" });
      return;
    }
    const created = (data as Invitation[]) ?? [];
    for (const inv of created) {
      await sendInviteEmail(inv);
    }
    setSending(false);
    toast({
      title: "Invitations sent",
      description: `${created.length} employee(s) received an invitation email.`,
    });
    setList([]);
    loadInvitations();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">Invite employees</h1>
        {orgName && <p className="text-muted-foreground mt-1">Company: {orgName}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Email Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
            <div className="space-y-1">
              <Label htmlFor="inv-name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-blue" />
                <Input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} className="pl-9"
                  onKeyDown={(e) => e.key === "Enter" && add()} />
              </div>
              <p className="text-xs text-muted-foreground">Enter the full name of the user</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="inv-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-blue" />
                <Input id="inv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9"
                  onKeyDown={(e) => e.key === "Enter" && add()} />
              </div>
            </div>
            <Button onClick={add} className="bg-brand-blue hover:bg-brand-blue/90 uppercase h-10">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          <p className="text-sm text-muted-foreground border-b pb-4">
            Enter names and email addresses one by one and click "Add" or press Enter
          </p>

          {list.length > 0 && (
            <div className="border rounded-md divide-y">
              {list.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-4 py-2 text-sm">
                  <div>
                    <span className="font-medium">{r.name || "—"}</span>
                    <span className="text-muted-foreground ml-2">{r.email}</span>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {list.length > 0 && (
            <div className="flex justify-end">
              <Button onClick={sendAll} disabled={sending || orgLoading || !orgId}
                className="bg-brand-purple hover:bg-brand-purple-dark uppercase">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <><Send className="h-4 w-4 mr-1" /> Send {list.length} invitation{list.length > 1 ? "s" : ""}</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bulk Upload from CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            />
            <Button variant="outline" className="border-brand-blue text-brand-blue uppercase" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1" /> Upload CSV
            </Button>
            <Button variant="ghost" className="text-brand-purple uppercase" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-1" /> Download Template
            </Button>
          </div>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Upload a CSV file with names and email addresses. The file should have a header row with "email,givenName"
              or contain one email and name per line. Download the template for the correct format.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {orgLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-brand-purple" /></div>
          ) : invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invitations yet.</p>
          ) : (
            <div className="border rounded-md divide-y">
              {invitations.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{inv.name || "—"}</div>
                    <div className="text-muted-foreground truncate">{inv.email}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs rounded-full px-2 py-1 ${inv.status === "accepted" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {inv.status}
                    </span>
                    {inv.status === "pending" && (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => copyLink(inv.token)} title="Copy invitation link">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => cancelInvite(inv.id)} title="Cancel invitation">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Add names and email addresses manually or upload a CSV file for bulk import</li>
            <li>Each invitation gets a personal join link you can copy and share</li>
            <li>Invited employees create their password and join your company automatically</li>
            <li>Accepted invitations are marked in the list above</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteUsers;
