import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Plus, Send, Trash2, Upload, X } from "lucide-react";
import BlogMedia from "@/components/blog/BlogMedia";

const LANGUAGES = ["en", "fi", "sv", "de", "fr", "es", "it", "nl", "da"];

interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  media_type: string;
  media_url: string | null;
  language: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

const emptyForm = {
  id: null as string | null,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  media_type: "none",
  media_url: "",
  language: "en",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const BlogManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PostRow[];
    },
  });

  const set = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleUpload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum size is 50 MB.",
        variant: "destructive",
      });
      return;
    }
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast({
        title: "Unsupported file",
        description: "Upload an image or a video.",
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("blog-media").upload(path, file, {
        contentType: file.type,
      });
      if (error) throw error;
      setForm((prev) => ({
        ...prev,
        media_url: path,
        media_type: isVideo ? "video" : "image",
      }));
      toast({ title: "Media uploaded" });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error?.message ?? "Unknown error",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const save = async (status: "draft" | "published") => {
    const title = form.title.trim();
    const content = form.content.trim();
    if (title.length < 3 || title.length > 200) {
      toast({
        title: "Title required",
        description: "Use between 3 and 200 characters.",
        variant: "destructive",
      });
      return;
    }
    if (content.length < 10) {
      toast({
        title: "Content too short",
        description: "Write at least 10 characters.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const payload = {
        title,
        slug: form.slug.trim() ? slugify(form.slug) : `${slugify(title)}-${Date.now().toString(36)}`,
        excerpt: form.excerpt.trim() || null,
        content,
        media_type: form.media_url.trim() ? form.media_type : "none",
        media_url: form.media_url.trim() || null,
        language: form.language,
        status,
        author_id: userData.user?.id ?? null,
        published_at: status === "published" ? new Date().toISOString() : null,
      };

      if (form.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }

      toast({
        title: status === "published" ? "Post published" : "Draft saved",
      });
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["public-blog-posts"] });
    } catch (error: any) {
      toast({
        title: "Saving failed",
        description: error?.message ?? "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const edit = (post: PostRow) => {
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      media_type: post.media_type,
      media_url: post.media_url ?? "",
      language: post.language,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (post: PostRow) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", post.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Post deleted" });
    queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    queryClient.invalidateQueries({ queryKey: ["public-blog-posts"] });
  };

  const togglePublish = async (post: PostRow) => {
    const next = post.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("blog_posts")
      .update({
        status: next,
        published_at: next === "published" ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: next === "published" ? "Post published" : "Post unpublished" });
    queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    queryClient.invalidateQueries({ queryKey: ["public-blog-posts"] });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {form.id ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {form.id ? "Edit blog post" : "New blog post"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input
                id="blog-title"
                value={form.title}
                maxLength={200}
                onChange={(e) => set("title", e.target.value)}
                placeholder="How teams build healthier habits"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-language">Language</Label>
              <Select value={form.language} onValueChange={(v) => set("language", v)}>
                <SelectTrigger id="blog-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-excerpt">Excerpt</Label>
            <Textarea
              id="blog-excerpt"
              value={form.excerpt}
              maxLength={400}
              rows={2}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short summary shown in the blog listing"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-content">Content</Label>
            <Textarea
              id="blog-content"
              value={form.content}
              maxLength={20000}
              rows={12}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Write the article. Empty lines create new paragraphs."
            />
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <Label>Image or video</Label>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" size="sm" disabled={uploading}>
                <label className="cursor-pointer">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload file
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </Button>
              <Input
                value={form.media_url}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    media_url: v,
                    media_type:
                      prev.media_type === "none" && v ? "image" : prev.media_type,
                  }));
                }}
                placeholder="…or paste an image/video URL"
                className="flex-1 min-w-[220px]"
              />
              <Select
                value={form.media_type}
                onValueChange={(v) => set("media_type", v)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No media</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
              {form.media_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setForm((p) => ({ ...p, media_url: "", media_type: "none" }))}
                >
                  <X className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>
            {form.media_url && form.media_type !== "none" && (
              <BlogMedia
                path={form.media_url}
                type={form.media_type}
                alt={form.title}
                className="max-h-64 rounded-md w-auto"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => save("published")} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Publish
            </Button>
            <Button variant="outline" onClick={() => save("draft")} disabled={saving}>
              Save as draft
            </Button>
            {form.id && (
              <Button variant="ghost" onClick={() => setForm(emptyForm)} disabled={saving}>
                Cancel editing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blog posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && posts.length === 0 && (
            <p className="text-sm text-muted-foreground">No blog posts yet.</p>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4"
            >
              <div className="min-w-[200px] flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{post.title}</p>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                  <Badge variant="outline">{post.language.toUpperCase()}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {post.excerpt || post.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {post.published_at
                    ? `Published ${new Date(post.published_at).toLocaleString()}`
                    : `Created ${new Date(post.created_at).toLocaleString()}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => togglePublish(post)}>
                  {post.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => edit(post)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(post)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManager;
