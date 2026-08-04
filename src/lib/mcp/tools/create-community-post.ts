import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_community_post",
  title: "Create a community post",
  description: "Publish a post to the Vointy community feed as the signed-in user.",
  inputSchema: {
    content: z.string().trim().describe("Post text."),
    image_url: z.string().url().describe("Optional image URL to attach.").optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ content, image_url }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!content) {
      return { content: [{ type: "text", text: "Post content is required" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", ctx.getUserId())
      .maybeSingle();

    const { data, error } = await supabase
      .from("community_posts")
      .insert({
        user_id: ctx.getUserId(),
        content,
        image_url: image_url ?? null,
        organization_id: profile?.organization_id ?? null,
      })
      .select("id,content,image_url,created_at")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Posted. ${JSON.stringify(data)}` }],
      structuredContent: { post: data },
    };
  },
});
