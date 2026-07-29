import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const teams = [
  { name: "Marketing", members: 0 },
  { name: "Engineering", members: 0 },
  { name: "Sales", members: 0 },
];

const Teams = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">Teams</h1>
        <p className="text-muted-foreground mt-1">Organise employees into teams — unlimited size and count.</p>
      </div>
      <Button className="bg-brand-purple hover:bg-brand-purple-dark">Create team</Button>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((t) => (
        <Card key={t.name}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-brand-purple" /> {t.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t.members} members
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
export default Teams;
