import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";

type AdminUser = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  is_admin: boolean;
  created_at: string;
};

const AdminRoles: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [grantEmail, setGrantEmail] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_list_users");
      if (error) throw error;
      return (data ?? []) as AdminUser[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users ?? [];
    return (users ?? []).filter(
      (u) =>
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.display_name ?? "").toLowerCase().includes(q)
    );
  }, [users, search]);

  const setRole = async (email: string, grant: boolean, key: string) => {
    if (!email) return;
    setBusy(key);
    const { error } = await supabase.rpc("admin_set_admin_role", {
      _email: email,
      _grant: grant,
    });
    setBusy(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: grant ? "Admin rights granted" : "Admin rights removed",
      description: email,
    });
    setGrantEmail("");
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const admins = (users ?? []).filter((u) => u.is_admin);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grant admin rights</CardTitle>
          <CardDescription>
            Give another registered user full admin access by email. Current admins: {admins.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setRole(grantEmail.trim(), true, "grant");
            }}
          >
            <Input
              type="email"
              required
              placeholder="user@example.com"
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
            />
            <Button type="submit" disabled={busy === "grant"}>
              {busy === "grant" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Make admin
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Search users and manage their admin role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search by email or name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.slice(0, 100).map((u) => {
                    const isSelf = u.user_id === user?.id;
                    return (
                      <TableRow key={u.user_id}>
                        <TableCell className="font-medium">{u.email}</TableCell>
                        <TableCell>{u.display_name ?? "—"}</TableCell>
                        <TableCell>
                          {u.is_admin ? (
                            <Badge>Admin</Badge>
                          ) : (
                            <Badge variant="secondary">User</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {u.is_admin ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isSelf || busy === u.user_id}
                              onClick={() => setRole(u.email ?? "", false, u.user_id)}
                            >
                              {busy === u.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <ShieldOff className="h-4 w-4 mr-2" />
                                  {isSelf ? "You" : "Remove admin"}
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              disabled={busy === u.user_id}
                              onClick={() => setRole(u.email ?? "", true, u.user_id)}
                            >
                              {busy === u.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Make admin
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRoles;
