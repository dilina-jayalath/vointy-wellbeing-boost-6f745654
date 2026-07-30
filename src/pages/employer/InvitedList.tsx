import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";


interface Row {
  id: string;
  name: string | null;
  email: string;
  status: string;
  created_at: string;
  accepted_at: string | null;
}

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

const InvitedList = () => {
  const { orgId, loading: orgLoading } = useEmployerOrg();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (row: Row) => {
    setRemovingId(row.id);
    const { error } = await supabase
      .from("organization_invitations")
      .delete()
      .eq("id", row.id);
    setRemovingId(null);
    if (error) {
      toast.error("Could not remove invitation", { description: error.message });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    toast.success(`Removed ${row.email}`);
  };


  useEffect(() => {
    if (!orgId) return;
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("organization_invitations")
        .select("id, name, email, status, created_at, accepted_at")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });
      if (!active) return;
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [orgId]);

  const activated = rows.filter((r) => r.status === "accepted").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">Invited List</h1>
        <p className="text-muted-foreground mt-1">
          All invited employees, their invitation date and activation status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Invitations ({rows.length}) · Activated: {activated}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orgLoading || loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-brand-purple" />
            </div>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invitations yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email address</TableHead>
                  <TableHead>Invitation date</TableHead>
                  <TableHead>Activated</TableHead>
                  <TableHead>Activation date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name || "—"}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{fmt(r.created_at)}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs rounded-full px-2 py-1 ${
                          r.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {r.status === "accepted" ? "Activated" : "Not activated"}
                      </span>
                    </TableCell>
                    <TableCell>{fmt(r.accepted_at)}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                            disabled={removingId === r.id}
                          >
                            {removingId === r.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove invitation?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This removes the invitation for {r.email}. The invitation link will stop working.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemove(r)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitedList;
