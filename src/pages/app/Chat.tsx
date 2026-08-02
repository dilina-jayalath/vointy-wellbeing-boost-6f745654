import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Send, Users } from "lucide-react";

type Team = { id: string; name: string };
type Message = {
  id: string;
  team_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

const AppChat = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Load the teams the signed-in user belongs to
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("team_id, teams(id, name)")
        .eq("user_id", user.id);
      if (cancelled) return;
      if (error) {
        toast({ title: t("appPanel.chat.toast.couldNotLoad"), description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      const list = (data ?? [])
        .map((row: any) => row.teams)
        .filter(Boolean)
        .map((tm: any) => ({ id: tm.id, name: tm.name })) as Team[];
      setTeams(list);
      setTeamId((prev) => prev ?? list[0]?.id ?? null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, t]);

  const loadNames = async (ids: string[]) => {
    const missing = ids.filter((id) => !names[id]);
    if (missing.length === 0) return;
    const { data } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", missing);
    if (!data) return;
    setNames((prev) => {
      const next = { ...prev };
      data.forEach((p: any) => {
        next[p.user_id] = p.display_name || t("appPanel.chat.member");
      });
      return next;
    });
  };

  // Load messages + subscribe to realtime updates for the selected team
  useEffect(() => {
    if (!teamId) {
      setMessages([]);
      return;
    }
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("team_messages")
        .select("id, team_id, user_id, content, created_at")
        .eq("team_id", teamId)
        .order("created_at", { ascending: true })
        .limit(200);
      if (cancelled) return;
      if (error) {
        toast({ title: t("appPanel.chat.toast.couldNotLoad"), description: error.message, variant: "destructive" });
        return;
      }
      setMessages(data ?? []);
      loadNames([...new Set((data ?? []).map((m: any) => m.user_id))] as string[]);
    })();

    const channel = supabase
      .channel(`team-messages-${teamId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "team_messages", filter: `team_id=eq.${teamId}` },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
          loadNames([msg.user_id]);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const activeTeam = useMemo(() => teams.find((tm) => tm.id === teamId), [teams, teamId]);

  const send = async () => {
    if (!user || !teamId || !text.trim()) return;
    setSending(true);
    const { error } = await supabase
      .from("team_messages")
      .insert({ team_id: teamId, user_id: user.id, content: text.trim() });
    setSending(false);
    if (error) {
      toast({ title: t("appPanel.chat.toast.couldNotSend"), description: error.message, variant: "destructive" });
      return;
    }
    setText("");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("appPanel.chat.title")}</h1>

      {loading && <p className="text-sm text-muted-foreground">{t("appPanel.chat.loading")}</p>}

      {!loading && teams.length === 0 && (
        <Card>
          <CardContent className="p-4 space-y-2 text-center">
            <Users className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("appPanel.chat.noTeams")}</p>
          </CardContent>
        </Card>
      )}

      {teams.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {teams.map((tm) => (
            <button
              key={tm.id}
              onClick={() => setTeamId(tm.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs border ${
                tm.id === teamId
                  ? "bg-brand-purple text-primary-foreground border-transparent"
                  : "text-muted-foreground"
              }`}
            >
              {tm.name}
            </button>
          ))}
        </div>
      )}

      {teamId && (
        <>
          {activeTeam && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" /> {activeTeam.name}
            </p>
          )}

          <div className="space-y-2 min-h-[40vh]">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">{t("appPanel.chat.noMessages")}</p>
            )}
            {messages.map((m) => {
              const mine = m.user_id === user?.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      mine ? "bg-brand-purple text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {!mine && (
                      <span className="block text-[11px] font-medium opacity-70">
                        {names[m.user_id] ?? t("appPanel.chat.member")}
                      </span>
                    )}
                    <span className="whitespace-pre-wrap">{m.content}</span>
                    <span className="block text-[10px] opacity-70 mt-1">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="sticky bottom-20 flex gap-2 bg-background py-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={t("appPanel.chat.placeholder")}
            />
            <Button size="icon" onClick={send} disabled={sending || !text.trim()} aria-label={t("appPanel.chat.send")}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AppChat;
