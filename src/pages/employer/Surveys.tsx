import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const LANGS = ["EN", "FI", "SV", "DE", "FR", "IT", "ES"] as const;
type Lang = (typeof LANGS)[number];

type LangMap = Record<Lang, string>;
const emptyLangMap = (): LangMap =>
  LANGS.reduce((acc, l) => ({ ...acc, [l]: "" }), {} as LangMap);

const LangTabs = ({
  active,
  onChange,
}: {
  active: Lang;
  onChange: (l: Lang) => void;
}) => (
  <div className="flex gap-6 border-b">
    {LANGS.map((l) => (
      <button
        key={l}
        type="button"
        onClick={() => onChange(l)}
        className={cn(
          "pb-2 text-sm font-semibold tracking-wide transition-colors",
          active === l
            ? "text-cyan-500 border-b-2 border-cyan-500"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {l}
      </button>
    ))}
  </div>
);

const Surveys = () => {
  const { toast } = useToast();
  const [titleLang, setTitleLang] = useState<Lang>("EN");
  const [descLang, setDescLang] = useState<Lang>("EN");
  const [titles, setTitles] = useState<LangMap>(emptyLangMap());
  const [descriptions, setDescriptions] = useState<LangMap>(emptyLangMap());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const canSave =
    titles.EN.trim().length > 0 && startDate !== "" && endDate !== "";

  const handleSave = () => {
    toast({
      title: "Survey saved",
      description: `"${titles.EN}" scheduled ${startDate} → ${endDate}.`,
    });
    setTitles(emptyLangMap());
    setDescriptions(emptyLangMap());
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-purple">Create a survey</h1>

      <Card>
        <CardContent className="p-6 space-y-8">
          <div className="space-y-3">
            <LangTabs active={titleLang} onChange={setTitleLang} />
            <Input
              placeholder="Title"
              value={titles[titleLang]}
              onChange={(e) =>
                setTitles({ ...titles, [titleLang]: e.target.value })
              }
            />
          </div>

          <div className="space-y-3">
            <LangTabs active={descLang} onChange={setDescLang} />
            <Textarea
              placeholder="Description"
              rows={4}
              value={descriptions[descLang]}
              onChange={(e) =>
                setDescriptions({ ...descriptions, [descLang]: e.target.value })
              }
            />
          </div>

          <div className="grid gap-4 max-w-sm">
            <div className="space-y-1">
              <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                Start Date *
              </Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                End Date *
              </Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t pt-4 -mx-6 px-6 bg-muted/30">
            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="bg-brand-purple hover:bg-brand-purple-dark uppercase"
            >
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Surveys;
