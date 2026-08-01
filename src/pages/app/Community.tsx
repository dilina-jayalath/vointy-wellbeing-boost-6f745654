import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCommunityFeed } from "@/hooks/useAppData";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Send } from "lucide-react";

const AppCommunity = () => {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: posts, isLoading } = useCommunityFeed();
  const [content, setContent] = useState("");
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const refresh = () => qc.invalidateQueries({ queryKey: ["community-feed"] });

  const createPost = async () => {
    if (!user || !content.trim()) return;
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id,
      organization_id: (profile as any)?.organization_id ?? null,
      content: content.trim(),
    });
    if (error) {
      toast({ title: t("appPanel.community.toast.couldNotPost"), description: error.message, variant: "destructive" });
      return;
    }
    setContent("");
    refresh();
  };

  const toggleLike = async (post: any) => {
    if (!user) return;
    const existing = post.post_likes?.find((l: any) => l.user_id === user.id);
    if (existing) {
      await supabase.from("post_likes").delete().eq("id", existing.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: user.id });
    }
    refresh();
  };

  const addComment = async (postId: string) => {
    if (!user || !commentText.trim()) return;
    const { error } = await supabase
      .from("post_comments")
      .insert({ post_id: postId, user_id: user.id, content: commentText.trim() });
    if (error) {
      toast({ title: t("appPanel.community.toast.couldNotComment"), description: error.message, variant: "destructive" });
      return;
    }
    setCommentText("");
    refresh();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("appPanel.community.title")}</h1>

      <Card>
        <CardContent className="p-4 space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("appPanel.community.placeholder")}
            rows={3}
          />
          <Button size="sm" className="w-full" onClick={createPost} disabled={!content.trim()}>
            {t("appPanel.community.post")}
          </Button>
        </CardContent>
      </Card>

      {isLoading && <p className="text-sm text-muted-foreground">{t("appPanel.community.loading")}</p>}
      {!isLoading && (posts?.length ?? 0) === 0 && (
        <p className="text-sm text-muted-foreground">{t("appPanel.community.noPosts")}</p>
      )}

      {(posts ?? []).map((p: any) => {
        const liked = p.post_likes?.some((l: any) => l.user_id === user?.id);
        return (
          <Card key={p.id}>
            <CardContent className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                {new Date(p.created_at).toLocaleString()}
              </p>
              <p className="text-sm whitespace-pre-wrap">{p.content}</p>
              {p.image_url && (
                <img src={p.image_url} alt="" loading="lazy" className="rounded-md w-full" />
              )}
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => toggleLike(p)}
                  className={`flex items-center gap-1 ${liked ? "text-brand-purple" : "text-muted-foreground"}`}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  {p.post_likes?.length ?? 0}
                </button>
                <button
                  onClick={() => setOpenComments(openComments === p.id ? null : p.id)}
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <MessageCircle className="h-4 w-4" />
                  {p.post_comments?.length ?? 0}
                </button>
              </div>

              {openComments === p.id && (
                <div className="space-y-2 border-t pt-3">
                  {(p.post_comments ?? []).map((c: any) => (
                    <p key={c.id} className="text-sm">
                      <span className="text-muted-foreground text-xs block">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                      {c.content}
                    </p>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={t("appPanel.community.writeComment")}
                    />
                    <Button size="icon" onClick={() => addComment(p.id)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AppCommunity;
