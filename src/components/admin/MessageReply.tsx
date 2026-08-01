import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Reply } from "lucide-react";

interface Props {
  submission: {
    id: string;
    subject: string;
    message: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

const MessageReply = ({ submission }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const { data: replies = [] } = useQuery({
    queryKey: ["contact-replies", submission.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("contact_replies")
        .select("id, body, created_at")
        .eq("submission_id", submission.id)
        .order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  const send = async () => {
    const text = body.trim();
    if (text.length < 2 || text.length > 5000) {
      toast({
        title: "Reply is empty",
        description: "Write a message between 2 and 5000 characters.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Not signed in");

      const { data: inserted, error: insertError } = await supabase
        .from("contact_replies")
        .insert({
          submission_id: submission.id,
          admin_user_id: userId,
          subject: `Re: ${submission.subject}`,
          body: text,
          recipient_email: submission.email,
        })
        .select("id")
        .single();
      if (insertError) throw insertError;

      const { error: mailError } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-reply",
          recipientEmail: submission.email,
          idempotencyKey: `contact-reply-${inserted.id}`,
          templateData: {
            name: submission.first_name,
            replyBody: text,
            originalSubject: submission.subject,
            originalMessage: submission.message,
          },
        },
      });
      if (mailError) throw mailError;

      toast({ title: "Reply sent", description: `Email sent to ${submission.email}` });
      setBody("");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["contact-replies", submission.id] });
    } catch (error: any) {
      toast({
        title: "Sending failed",
        description: error?.message ?? "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      {replies.length > 0 && (
        <div className="space-y-2">
          {replies.map((r: any) => (
            <div key={r.id} className="rounded-md bg-muted/60 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Reply · {new Date(r.created_at).toLocaleString()}
              </p>
              <p className="text-sm whitespace-pre-wrap mt-1">{r.body}</p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Reply className="h-4 w-4 mr-2" />
            {replies.length > 0 ? "Reply again" : "Reply"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {submission.first_name} {submission.last_name}</DialogTitle>
            <DialogDescription>
              An email is sent to {submission.email} with the subject “Re: {submission.subject}”.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border p-3 max-h-32 overflow-y-auto">
            <p className="text-xs text-muted-foreground">Original message</p>
            <p className="text-sm whitespace-pre-wrap mt-1">{submission.message}</p>
          </div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={7}
            maxLength={5000}
            placeholder="Write your reply…"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button onClick={send} disabled={sending}>
              {sending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Send reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageReply;
