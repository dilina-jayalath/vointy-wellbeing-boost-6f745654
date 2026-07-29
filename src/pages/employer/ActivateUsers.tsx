import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Row { id: string; name: string; email: string; }

const ActivateUsers = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const users: Row[] = [];
  const { toast } = useToast();

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())
      ),
    [query, users]
  );

  const allSelected = filtered.length > 0 && filtered.every((u) => selected.has(u.id));
  const toggleAll = () => {
    const s = new Set(selected);
    if (allSelected) filtered.forEach((u) => s.delete(u.id));
    else filtered.forEach((u) => s.add(u.id));
    setSelected(s);
  };
  const toggle = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const send = () => {
    toast({
      title: "Activation reminders sent",
      description: `${selected.size} user(s) will receive a reminder.`,
    });
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-purple">Activate Users</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Input
            placeholder="Search by Name or Email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="border rounded-md">
            <div className="grid grid-cols-12 px-4 py-3 border-b text-sm font-semibold items-center">
              <div className="col-span-1">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </div>
              <div className="col-span-5">Name</div>
              <div className="col-span-6">Email</div>
            </div>
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No users found</div>
            ) : (
              filtered.map((u) => (
                <div key={u.id} className="grid grid-cols-12 px-4 py-3 border-b items-center text-sm">
                  <div className="col-span-1">
                    <Checkbox checked={selected.has(u.id)} onCheckedChange={() => toggle(u.id)} />
                  </div>
                  <div className="col-span-5">{u.name}</div>
                  <div className="col-span-6">{u.email}</div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={send}
              disabled={selected.size === 0}
              className="bg-brand-purple hover:bg-brand-purple-dark uppercase"
            >
              <Send className="h-4 w-4 mr-1" /> Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivateUsers;
