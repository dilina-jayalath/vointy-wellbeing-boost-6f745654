import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const InviteUsers = () => {
  const [emails, setEmails] = useState("");
  const [team, setTeam] = useState("");
  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = emails.split(/[,\s]+/).filter(Boolean);
    toast({ title: `Invitations queued`, description: `${list.length} email(s) to team "${team || "—"}"` });
    setEmails("");
    setTeam("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">Invite Users</h1>
        <p className="text-muted-foreground mt-1">Send invitations to your employees by email.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team">Team (optional)</Label>
              <Input id="team" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="e.g. Marketing" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emails">Emails</Label>
              <Textarea
                id="emails"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="alice@company.com, bob@company.com"
                rows={6}
                required
              />
            </div>
            <Button type="submit" className="bg-brand-purple hover:bg-brand-purple-dark">
              Send invitations
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default InviteUsers;
