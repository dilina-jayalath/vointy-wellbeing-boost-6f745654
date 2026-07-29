import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  description: string;
  sections?: { title: string; body: string }[];
}

const Placeholder = ({ title, description, sections = [] }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="text-base">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{s.body}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Placeholder;
