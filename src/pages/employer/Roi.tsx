import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, AlertCircle, TrendingDown, Euro, Calculator, Trash2 } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";
import { toast } from "@/hooks/use-toast";

interface MonthlyRow {
  month: string;
  sick_days: number;
  absent_employees: number;
  headcount: number;
  sick_day_cost: number;
  points: number;
  exercises: number;
  active_employees: number;
  index_per_employee: number;
}
interface Summary {
  cost_per_sick_day: number;
  monthly_cost: number;
  months_with_data: number;
  sick_days_12m: number;
  sick_days_prev_12m: number;
  sick_days_change_pct: number;
  savings_12m: number;
  subscription_cost_12m: number;
  roi_pct: number;
  total_employees: number;
  sick_days_per_employee_12m: number;
}
interface ParsedRow {
  period: string;
  team_name: string;
  sick_days: number;
  absent_employees: number | null;
  headcount: number | null;
}

const normalizeHeader = (h: string) =>
  h.trim().toLowerCase().replace(/^\uFEFF/, "").replace(/[\s_-]/g, "");

const HEADER_MAP: Record<string, keyof ParsedRow | "period"> = {
  month: "period",
  period: "period",
  kuukausi: "period",
  date: "period",
  sickdays: "sick_days",
  sickleavedays: "sick_days",
  days: "sick_days",
  sairauspoissaolot: "sick_days",
  sairauspoissaolopaivat: "sick_days",
  poissaolopaivat: "sick_days",
  team: "team_name",
  tiimi: "team_name",
  teamname: "team_name",
  absentemployees: "absent_employees",
  absent: "absent_employees",
  poissaolevat: "absent_employees",
  headcount: "headcount",
  employees: "headcount",
  henkilosto: "headcount",
};

const parsePeriod = (raw: string): string | null => {
  const v = raw.trim();
  if (!v) return null;
  let m = v.match(/^(\d{4})[-/.](\d{1,2})/); // 2026-01
  if (m) return `${m[1]}-${String(Number(m[2])).padStart(2, "0")}-01`;
  m = v.match(/^(\d{1,2})[-/.](\d{4})$/); // 01/2026
  if (m) return `${m[2]}-${String(Number(m[1])).padStart(2, "0")}-01`;
  const d = new Date(v);
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  }
  return null;
};

const parseNumber = (raw: string | undefined): number | null => {
  if (raw === undefined) return null;
  const v = raw.replace(/\s/g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  if (!v) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const parseCsv = (text: string): { rows: ParsedRow[]; skipped: number } => {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return { rows: [], skipped: 0 };
  const delimiter = (lines[0].match(/;/g)?.length ?? 0) > (lines[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  const headers = lines[0].split(delimiter).map((h) => HEADER_MAP[normalizeHeader(h)] ?? null);
  const rows: ParsedRow[] = [];
  let skipped = 0;
  for (const line of lines.slice(1)) {
    const cells = line.split(delimiter);
    const rec: Record<string, string> = {};
    headers.forEach((key, i) => {
      if (key) rec[key] = (cells[i] ?? "").trim();
    });
    const period = parsePeriod(rec.period ?? "");
    const sickDays = parseNumber(rec.sick_days);
    if (!period || sickDays === null) {
      skipped++;
      continue;
    }
    rows.push({
      period,
      team_name: rec.team_name ?? "",
      sick_days: sickDays,
      absent_employees: parseNumber(rec.absent_employees),
      headcount: parseNumber(rec.headcount),
    });
  }
  return { rows, skipped };
};

const Roi = () => {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [monthly, setMonthly] = useState<MonthlyRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [costPerDay, setCostPerDay] = useState("350");
  const [monthlyCost, setMonthlyCost] = useState("149");
  const [hasRecords, setHasRecords] = useState(false);

  const load = async () => {
    setLoading(true);
    const db = supabase as any;
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    let org: string | null = null;
    if (uid) {
      const { data: profile } = await db
        .from("profiles")
        .select("organization_id")
        .eq("user_id", uid)
        .maybeSingle();
      org = profile?.organization_id ?? null;
    }
    setOrgId(org);

    const [mo, su, cnt] = await Promise.all([
      db.rpc("org_roi_monthly"),
      db.rpc("org_roi_summary"),
      db.from("sick_leave_records").select("id", { count: "exact", head: true }),
    ]);
    const firstError = [mo, su].find((r: any) => r.error)?.error;
    if (firstError) {
      setError(firstError.message ?? "error");
    } else {
      setError(null);
      setMonthly((mo.data as MonthlyRow[]) ?? []);
      const s = (su.data?.[0] as Summary) ?? null;
      setSummary(s);
      if (s) {
        setCostPerDay(String(s.cost_per_sick_day ?? 350));
        setMonthlyCost(String(s.monthly_cost ?? 149));
      }
    }
    setHasRecords((cnt?.count ?? 0) > 0);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleFile = async (file: File) => {
    if (!orgId) {
      toast({
        title: t("employerPanel.roi.upload.errorTitle") as string,
        description: t("employerPanel.roi.upload.noOrg") as string,
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    try {
      const text = await file.text();
      const { rows, skipped } = parseCsv(text);
      if (rows.length === 0) {
        toast({
          title: t("employerPanel.roi.upload.errorTitle") as string,
          description: t("employerPanel.roi.upload.noRows") as string,
          variant: "destructive",
        });
        return;
      }
      const { data: userData } = await supabase.auth.getUser();
      const payload = rows.map((r) => ({
        organization_id: orgId,
        period: r.period,
        team_name: r.team_name,
        sick_days: r.sick_days,
        absent_employees: r.absent_employees,
        headcount: r.headcount,
        source_file: file.name,
        created_by: userData?.user?.id ?? null,
      }));
      const { error: upsertError } = await (supabase as any)
        .from("sick_leave_records")
        .upsert(payload, { onConflict: "organization_id,period,team_name" });
      if (upsertError) throw upsertError;
      toast({
        title: t("employerPanel.roi.upload.successTitle") as string,
        description: `${rows.length} ${t("employerPanel.roi.upload.rowsImported")}${
          skipped ? ` · ${skipped} ${t("employerPanel.roi.upload.rowsSkipped")}` : ""
        }`,
      });
      await load();
    } catch (e: any) {
      toast({
        title: t("employerPanel.roi.upload.errorTitle") as string,
        description: e?.message ?? "error",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const saveSettings = async () => {
    if (!orgId) return;
    const { error: updateError } = await (supabase as any)
      .from("organizations")
      .update({
        cost_per_sick_day: Number(costPerDay) || 0,
        roi_monthly_cost: Number(monthlyCost) || 0,
      })
      .eq("id", orgId);
    if (updateError) {
      toast({
        title: t("employerPanel.roi.settings.errorTitle") as string,
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: t("employerPanel.roi.settings.saved") as string });
    await load();
  };

  const clearData = async () => {
    if (!orgId) return;
    const { error: delError } = await (supabase as any)
      .from("sick_leave_records")
      .delete()
      .eq("organization_id", orgId);
    if (delError) {
      toast({
        title: t("employerPanel.roi.upload.errorTitle") as string,
        description: delError.message,
        variant: "destructive",
      });
      return;
    }
    await load();
  };

  const monthLabel = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: "short", year: "2-digit" });

  const chartData = monthly.map((m) => ({
    month: monthLabel(m.month),
    sickDays: Number(m.sick_days),
    index: Number(m.index_per_employee),
  }));

  const money = (v: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
      v || 0,
    );

  const rowsWithData = monthly.filter((m) => Number(m.sick_days) > 0 || Number(m.points) > 0).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">{t("employerPanel.roi.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("employerPanel.roi.description")}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("employerPanel.roi.errorTitle")}</AlertTitle>
          <AlertDescription>{t("employerPanel.roi.errorBody")}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
            <Upload className="h-4 w-4 text-brand-purple" />
            {t("employerPanel.roi.upload.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("employerPanel.roi.upload.help")}</p>
          <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto">
month,sick_days,team,absent_employees,headcount{"\n"}2026-01,42,Sales,7,25{"\n"}2026-02,31.5,Sales,5,25
          </pre>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="max-w-sm"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {hasRecords && (
              <Button variant="outline" size="sm" onClick={clearData}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("employerPanel.roi.upload.clear")}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{t("employerPanel.roi.upload.privacyNote")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
            <Calculator className="h-4 w-4 text-brand-purple" />
            {t("employerPanel.roi.settings.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <Label htmlFor="costPerDay">{t("employerPanel.roi.settings.costPerDay")}</Label>
            <Input
              id="costPerDay"
              type="number"
              min="0"
              className="w-40"
              value={costPerDay}
              onChange={(e) => setCostPerDay(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="monthlyCost">{t("employerPanel.roi.settings.monthlyCost")}</Label>
            <Input
              id="monthlyCost"
              type="number"
              min="0"
              className="w-40"
              value={monthlyCost}
              onChange={(e) => setMonthlyCost(e.target.value)}
            />
          </div>
          <Button onClick={saveSettings}>{t("employerPanel.roi.settings.save")}</Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <TrendingDown className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.roi.kpi.sickDays12m")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">{summary?.sick_days_12m ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.roi.kpi.prev12m")}: {summary?.sick_days_prev_12m ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-muted-foreground">
                  {t("employerPanel.roi.kpi.change")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {Number(summary?.sick_days_change_pct ?? 0) > 0 ? "+" : ""}
                  {summary?.sick_days_change_pct ?? 0}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.roi.kpi.perEmployee")}: {summary?.sick_days_per_employee_12m ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                  <Euro className="h-4 w-4 text-brand-purple" />
                  {t("employerPanel.roi.kpi.savings")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">
                  {money(Number(summary?.savings_12m ?? 0))}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.roi.kpi.subscriptionCost")}:{" "}
                  {money(Number(summary?.subscription_cost_12m ?? 0))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-muted-foreground">
                  {t("employerPanel.roi.kpi.roi")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand-blue">{summary?.roi_pct ?? 0}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("employerPanel.roi.kpi.monthsWithData")}: {summary?.months_with_data ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">
                {t("employerPanel.roi.chartTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {!hasRecords ? (
                <p className="text-sm text-muted-foreground">{t("employerPanel.roi.noData")}</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis yAxisId="left" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="sickDays"
                      name={t("employerPanel.roi.chart.sickDays") as string}
                      fill="hsl(var(--muted-foreground))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="index"
                      name={t("employerPanel.roi.chart.index") as string}
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">
                {t("employerPanel.roi.tableTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rowsWithData.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("employerPanel.roi.noData")}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("employerPanel.roi.table.month")}</TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.roi.table.sickDays")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.roi.table.cost")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.roi.table.points")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.roi.table.activeEmployees")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("employerPanel.roi.table.index")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rowsWithData.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell className="font-medium">{monthLabel(row.month)}</TableCell>
                        <TableCell className="text-right">{row.sick_days}</TableCell>
                        <TableCell className="text-right">
                          {money(Number(row.sick_day_cost))}
                        </TableCell>
                        <TableCell className="text-right">{row.points}</TableCell>
                        <TableCell className="text-right">{row.active_employees}</TableCell>
                        <TableCell className="text-right">{row.index_per_employee}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Roi;
