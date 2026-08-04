import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_community_posts",
  title: "List community posts",
  description: "List the most recent community feed posts visible to the signed-in user.",
  inputSchema: {
    limit: z.number().int().describe("Maximum number of posts (default 20).").optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("community_posts")
      .select("id,content,image_url,created_at,activity_id,challenge_id")
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 20, 1), 100));
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});
