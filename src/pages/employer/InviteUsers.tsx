import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Download, Info, Trash2, User, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recipient { id: string; name: string; email: string; }

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const InviteUsers = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [list, setList] = useState<Recipient[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    const header = lines[0]?.toLowerCase().includes("email") ? lines.slice(1) : lines;
    const parsed: Recipient[] = [];
    for (const line of header) {
      const [a, b] = line.split(",").map((s) => s.trim());
      const em = emailRe.test(a) ? a : emailRe.test(b) ? b : "";
      const nm = emailRe.test(a) ? b || "" : a || "";
      if (em) parsed.push({ id: crypto.randomUUID(), name: nm, email: em });
    }
    setList((l) => [...l, ...parsed]);
    toast({ title: "CSV imported", description: `${parsed.length} recipient(s) added.` });
  };

  const sendAll = () => {
    toast({ title: "Invitations sent", description: `${list.length} invitation(s) queued.` });
    setList([]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-purple">Add Users</h1>

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
          <CardTitle className="text-lg">How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Add names and email addresses manually or upload a CSV file for bulk import</li>
            <li>Download the CSV template to see the correct format</li>
            <li>Users will receive an invitation to join the Vointy App</li>
            <li>You can add multiple names and emails and send all invites at once</li>
            <li>Invalid emails or names will be highlighted and can be corrected</li>
          </ul>
        </CardContent>
      </Card>

      {list.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={sendAll} className="bg-brand-purple hover:bg-brand-purple-dark uppercase">
            Send {list.length} Invitation{list.length > 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InviteUsers;
