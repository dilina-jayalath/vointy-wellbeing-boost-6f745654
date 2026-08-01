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
import { useTranslation } from "@/lib/i18n";


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
  const { t } = useTranslation();

  const handleRemove = async (row: Row) => {
    setRemovingId(row.id);
    const { error } = await supabase
      .from("organization_invitations")
      .delete()
      .eq("id", row.id);
    setRemovingId(null);
    if (error) {
      toast.error(t("employerPanel.invitedList.removeFailedTitle") as string, { description: error.message });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    toast.success((t("employerPanel.invitedList.removedToast") as string).replace("{email}", row.email));
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
        <h1 className="text-3xl font-bold text-brand-purple">{t("employerPanel.invitedList.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("employerPanel.invitedList.description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {(t("employerPanel.invitedList.cardTitle") as string)
              .replace("{count}", String(rows.length))
              .replace("{activated}", String(activated))}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orgLoading || loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-brand-purple" />
            </div>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("employerPanel.invitedList.empty")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("employerPanel.invitedList.columns.name")}</TableHead>
                  <TableHead>{t("employerPanel.invitedList.columns.email")}</TableHead>
                  <TableHead>{t("employerPanel.invitedList.columns.invitationDate")}</TableHead>
                  <TableHead>{t("employerPanel.invitedList.columns.activated")}</TableHead>
                  <TableHead>{t("employerPanel.invitedList.columns.activationDate")}</TableHead>
                  <TableHead className="text-right">{t("employerPanel.invitedList.columns.actions")}</TableHead>

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
                        {r.status === "accepted" ? t("employerPanel.invitedList.activated") : t("employerPanel.invitedList.notActivated")}
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
                            {t("employerPanel.invitedList.remove")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("employerPanel.invitedList.removeConfirmTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {(t("employerPanel.invitedList.removeConfirmDescription") as string).replace("{email}", r.email)}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("employerPanel.invitedList.cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemove(r)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {t("employerPanel.invitedList.remove")}
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
