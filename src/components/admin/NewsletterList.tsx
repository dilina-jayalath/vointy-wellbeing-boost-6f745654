import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Search } from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  language: string | null;
  created_at: string;
};

const NewsletterList = ({ subscribers }: { subscribers: Subscriber[] }) => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<string>("all");

  const languages = useMemo(
    () => Array.from(new Set(subscribers.map((s) => s.language || "-"))).sort(),
    [subscribers]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscribers.filter((s) => {
      const matchesQuery = !q || s.email.toLowerCase().includes(q);
      const matchesLang = lang === "all" || (s.language || "-") === lang;
      return matchesQuery && matchesLang;
    });
  }, [subscribers, query, lang]);

  const copyEmails = async () => {
    const list = filtered.map((s) => s.email).join(", ");
    try {
      await navigator.clipboard.writeText(list);
      toast({ title: "Copied", description: `${filtered.length} email addresses copied.` });
    } catch {
      toast({ title: "Copy failed", description: "Could not access clipboard.", variant: "destructive" });
    }
  };

  const downloadCsv = () => {
    const rows = [
      ["email", "language", "subscribed_at"],
      ...filtered.map((s) => [s.email, s.language || "", new Date(s.created_at).toISOString()]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>Newsletter address list</CardTitle>
            <CardDescription>
              {filtered.length} of {subscribers.length} subscribers
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyEmails} disabled={!filtered.length}>
              <Copy className="mr-2 h-4 w-4" /> Copy emails
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCsv} disabled={!filtered.length}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search email"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge
              variant={lang === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setLang("all")}
            >
              All
            </Badge>
            {languages.map((l) => (
              <Badge
                key={l}
                variant={lang === l ? "default" : "outline"}
                className="cursor-pointer uppercase"
                onClick={() => setLang(l)}
              >
                {l}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Subscribed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s, i) => (
              <TableRow key={s.id}>
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium">
                  <a href={`mailto:${s.email}`} className="hover:underline">
                    {s.email}
                  </a>
                </TableCell>
                <TableCell className="uppercase text-muted-foreground">{s.language || "-"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(s.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {!filtered.length && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  No subscribers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NewsletterList;
