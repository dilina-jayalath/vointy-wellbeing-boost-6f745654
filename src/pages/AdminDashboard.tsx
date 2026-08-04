import React, { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTranslation } from "@/lib/i18n";
import MessageReply from "@/components/admin/MessageReply";
import BlogManager from "@/components/admin/BlogManager";
import NewsletterList from "@/components/admin/NewsletterList";
import AdminRoles from "@/components/admin/AdminRoles";
import Seo from "@/components/Seo";





const PAID_AMOUNT = 149;

const monthKey = (d: string | Date) => {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const useAdminData = () =>
  useQuery({
    queryKey: ["admin-data"],
    queryFn: async () => {
      const [messages, subscribers, orgs, profiles, invitations, views, exercises] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
        supabase.from("organizations").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("organization_invitations").select("*").order("created_at", { ascending: false }),
        supabase.from("page_views").select("path, created_at, session_id").order("created_at", { ascending: false }).limit(5000),
        supabase
          .from("performed_exercises")
          .select("id, performed_at, activity_id, activities(title)")
          .order("performed_at", { ascending: false })
          .limit(5000),
      ]);
      return {
        messages: messages.data ?? [],
        subscribers: subscribers.data ?? [],
        orgs: orgs.data ?? [],
        profiles: profiles.data ?? [],
        invitations: invitations.data ?? [],
        views: views.data ?? [],
        exercises: exercises.data ?? [],
      };
    },
  });

const Stat = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardDescription>{label}</CardDescription>
      <CardTitle className="text-3xl">{value}</CardTitle>
    </CardHeader>
    {hint && <CardContent className="pt-0 text-xs text-muted-foreground">{hint}</CardContent>}
  </Card>
);

const AdminDashboard = () => {
  const { data, isLoading } = useAdminData();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  const paidOrgs = useMemo(() => (data?.orgs ?? []).filter((o: any) => o.plan === "paid"), [data]);
  const freeOrgs = useMemo(() => (data?.orgs ?? []).filter((o: any) => o.plan !== "paid"), [data]);

  const revenueSeries = useMemo(() => {
    const months: string[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(monthKey(d));
    }
    return months.map((m) => {
      const active = paidOrgs.filter((o: any) => monthKey(o.plan_started_at ?? o.created_at) <= m).length;
      const amount = paidOrgs
        .filter((o: any) => monthKey(o.plan_started_at ?? o.created_at) <= m)
        .reduce((sum: number, o: any) => sum + Number(o.monthly_amount || PAID_AMOUNT), 0);
      return { month: m, mrr: amount, customers: active };
    });
  }, [paidOrgs]);

  const viewsByDay = useMemo(() => {
    const map = new Map<string, { views: number; sessions: Set<string> }>();
    (data?.views ?? []).forEach((v: any) => {
      const day = new Date(v.created_at).toISOString().slice(0, 10);
      const entry = map.get(day) ?? { views: 0, sessions: new Set() };
      entry.views += 1;
      if (v.session_id) entry.sessions.add(v.session_id);
      map.set(day, entry);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-30)
      .map(([day, e]) => ({ day: day.slice(5), views: e.views, visitors: e.sessions.size }));
  }, [data]);

  const topPages = useMemo(() => {
    const map = new Map<string, number>();
    (data?.views ?? []).forEach((v: any) => map.set(v.path, (map.get(v.path) ?? 0) + 1));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([path, count]) => ({ path, count }));
  }, [data]);

  const topActivities = useMemo(() => {
    const map = new Map<string, number>();
    (data?.exercises ?? []).forEach((e: any) => {
      const title = e.activities?.title ?? "Unknown";
      map.set(title, (map.get(title) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([title, count]) => ({ title, count }));
  }, [data]);

  const activityByMonth = useMemo(() => {
    const map = new Map<string, number>();
    (data?.exercises ?? []).forEach((e: any) => {
      const m = monthKey(e.performed_at);
      map.set(m, (map.get(m) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([month, count]) => ({ month, count }));
  }, [data]);

  const togglePlan = async (org: any) => {
    const paid = org.plan === "paid";
    const { error } = await supabase
      .from("organizations")
      .update({
        plan: paid ? "free" : "paid",
        monthly_amount: paid ? 0 : PAID_AMOUNT,
        plan_started_at: paid ? null : new Date().toISOString(),
      })
      .eq("id", org.id);
    if (error) {
      toast({ title: t("adminPanel.customers.updateFailedTitle") as string, description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: paid ? (t("adminPanel.customers.movedToFree") as string) : (t("adminPanel.customers.markedPaying") as string) });
    queryClient.invalidateQueries({ queryKey: ["admin-data"] });
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  const mrr = paidOrgs.reduce((s: number, o: any) => s + Number(o.monthly_amount || PAID_AMOUNT), 0);
  const activatedEmployees = data.invitations.filter((i: any) => i.status === "accepted").length;

  return (
    <div className="min-h-screen py-10 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BackButton fallback="/" />
          <h1 className="text-3xl font-display">{t("adminPanel.title")}</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Stat
            label={t("adminPanel.stats.companies") as string}
            value={data.orgs.length}
            hint={(t("adminPanel.stats.companiesHint") as string)
              .replace("{paid}", String(paidOrgs.length))
              .replace("{free}", String(freeOrgs.length))}
          />
          <Stat
            label={t("adminPanel.stats.mrr") as string}
            value={`€${mrr.toLocaleString()}`}
            hint={t("adminPanel.stats.mrrHint") as string}
          />
          <Stat
            label={t("adminPanel.stats.registeredEmployees") as string}
            value={data.profiles.length}
            hint={(t("adminPanel.stats.registeredEmployeesHint") as string).replace("{count}", String(activatedEmployees))}
          />
          <Stat
            label={t("adminPanel.stats.pageViews") as string}
            value={data.views.length}
            hint={t("adminPanel.stats.pageViewsHint") as string}
          />
        </div>

        <Tabs defaultValue="messages">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="messages">
              {(t("adminPanel.tabs.messages") as string).replace("{count}", String(data.messages.length))}
            </TabsTrigger>
            <TabsTrigger value="customers">
              {(t("adminPanel.tabs.customers") as string).replace("{count}", String(data.orgs.length))}
            </TabsTrigger>
            <TabsTrigger value="revenue">{t("adminPanel.tabs.revenue")}</TabsTrigger>
            <TabsTrigger value="employees">
              {(t("adminPanel.tabs.employees") as string).replace("{count}", String(data.profiles.length))}
            </TabsTrigger>
            <TabsTrigger value="site">{t("adminPanel.tabs.site")}</TabsTrigger>
            <TabsTrigger value="activities">{t("adminPanel.tabs.activities")}</TabsTrigger>
            <TabsTrigger value="newsletter">
              {(t("adminPanel.tabs.newsletter") as string).replace("{count}", String(data.subscribers.length))}
            </TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="mt-4">
            <BlogManager />
          </TabsContent>

          <TabsContent value="admins" className="mt-4">
            <AdminRoles />
          </TabsContent>



          <TabsContent value="messages" className="mt-4">
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  key: "contact",
                  title: t("adminPanel.messages.contactTitle") as string,
                  description: t("adminPanel.messages.contactDescription") as string,
                  items: data.messages.filter((m: any) => m.category === "contact"),
                },
                {
                  key: "license",
                  title: t("adminPanel.messages.licenseTitle") as string,
                  description: t("adminPanel.messages.licenseDescription") as string,
                  items: data.messages.filter((m: any) => m.category === "license"),
                },
                {
                  key: "other",
                  title: t("adminPanel.messages.otherTitle") as string,
                  description: t("adminPanel.messages.otherDescription") as string,
                  items: data.messages.filter(
                    (m: any) => m.category !== "contact" && m.category !== "license",
                  ),
                },
              ].map((box) => (
                <Card key={box.key} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {box.title} ({box.items.length})
                    </CardTitle>
                    <CardDescription>{box.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                    {box.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t("adminPanel.messages.empty")}</p>
                    ) : (
                      box.items.map((m: any) => (
                        <div key={m.id} className="rounded-lg border p-4">
                          <p className="font-semibold text-sm">{m.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {m.first_name} {m.last_name} — {m.email}
                            {m.company_name && ` · ${m.company_name}`}
                          </p>
                          <p className="text-sm whitespace-pre-wrap mt-2">{m.message}</p>
                          <p className="text-xs text-muted-foreground mt-3">
                            {new Date(m.created_at).toLocaleString()}
                          </p>
                          <MessageReply submission={m} />

                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>


          <TabsContent value="customers" className="mt-4 space-y-6">
            {[
              { title: t("adminPanel.customers.paying") as string, rows: paidOrgs },
              { title: t("adminPanel.customers.free") as string, rows: freeOrgs },
            ].map((group) => (
              <Card key={group.title}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {group.title} ({group.rows.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("adminPanel.customers.columns.company")}</TableHead>
                        <TableHead>{t("adminPanel.customers.columns.plan")}</TableHead>
                        <TableHead>{t("adminPanel.customers.columns.monthly")}</TableHead>
                        <TableHead>{t("adminPanel.customers.columns.employees")}</TableHead>
                        <TableHead>{t("adminPanel.customers.columns.joined")}</TableHead>
                        <TableHead className="text-right">{t("adminPanel.customers.columns.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.rows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-muted-foreground">
                            {t("adminPanel.customers.noCompanies")}
                          </TableCell>
                        </TableRow>
                      ) : (
                        group.rows.map((o: any) => (
                          <TableRow key={o.id}>
                            <TableCell className="font-medium">{o.name}</TableCell>
                            <TableCell>
                              <Badge variant={o.plan === "paid" ? "default" : "secondary"}>
                                {o.plan === "paid" ? t("adminPanel.customers.paid") : t("adminPanel.customers.free_status")}
                              </Badge>
                            </TableCell>
                            <TableCell>€{Number(o.monthly_amount || 0)}</TableCell>
                            <TableCell>
                              {data.profiles.filter((p: any) => p.organization_id === o.id).length}
                            </TableCell>
                            <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline" onClick={() => togglePlan(o)}>
                                {o.plan === "paid" ? t("adminPanel.customers.setFree") : t("adminPanel.customers.markPaid")}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="revenue" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("adminPanel.revenue.chartTitle")}</CardTitle>
                <CardDescription>
                  {(t("adminPanel.revenue.chartDescription") as string).replace("{amount}", String(PAID_AMOUNT))}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="mrr" name={t("adminPanel.revenue.mrrLegend") as string} stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("adminPanel.revenue.customersChartTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="customers" name={t("adminPanel.revenue.customersLegend") as string} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("adminPanel.employees.tableTitle")}</CardTitle>
                <CardDescription>{t("adminPanel.employees.tableDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("adminPanel.employees.columns.name")}</TableHead>
                      <TableHead>{t("adminPanel.employees.columns.company")}</TableHead>
                      <TableHead>{t("adminPanel.employees.columns.language")}</TableHead>
                      <TableHead>{t("adminPanel.employees.columns.role")}</TableHead>
                      <TableHead>{t("adminPanel.employees.columns.registered")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.profiles.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.display_name ?? "—"}</TableCell>
                        <TableCell>
                          {data.orgs.find((o: any) => o.id === p.organization_id)?.name ?? "—"}
                        </TableCell>
                        <TableCell className="uppercase text-xs">{p.language ?? "—"}</TableCell>
                        <TableCell>{p.role ?? (t("adminPanel.employees.defaultRole") as string)}</TableCell>
                        <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="site" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("adminPanel.site.visitsTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={viewsByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="views" name={t("adminPanel.site.pageViewsLegend") as string} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="visitors" name={t("adminPanel.site.visitorsLegend") as string} fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("adminPanel.site.topPagesTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("adminPanel.site.columns.path")}</TableHead>
                      <TableHead className="text-right">{t("adminPanel.site.columns.views")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-muted-foreground">
                          {t("adminPanel.site.noVisits")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      topPages.map((p) => (
                        <TableRow key={p.path}>
                          <TableCell className="font-mono text-sm">{p.path}</TableCell>
                          <TableCell className="text-right">{p.count}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("adminPanel.activities.monthlyChartTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" name={t("adminPanel.activities.activitiesLegend") as string} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("adminPanel.activities.topActivitiesTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("adminPanel.activities.columns.activity")}</TableHead>
                      <TableHead className="text-right">{t("adminPanel.activities.columns.timesPerformed")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topActivities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-muted-foreground">
                          {t("adminPanel.activities.noActivities")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      topActivities.map((a) => (
                        <TableRow key={a.title}>
                          <TableCell>{a.title}</TableCell>
                          <TableCell className="text-right">{a.count}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="mt-4">
            <NewsletterList subscribers={data.subscribers as any} />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
