import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_activities",
  title: "Search activities",
  description:
    "Search the Vointy activity catalogue the signed-in user can access. Returns id, title, description, unit and points.",
  inputSchema: {
    query: z.string().trim().describe("Free-text search on the activity title.").optional(),
    limit: z.number().int().describe("Maximum number of activities to return (default 20).").optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let builder = supabase
      .from("activities")
      .select("id,title,description,unit,points,duration_minutes,category")
      .eq("is_active", true)
      .order("title", { ascending: true })
      .limit(Math.min(Math.max(limit ?? 20, 1), 100));
    if (query) builder = builder.ilike("title", `%${query}%`);

    const { data, error } = await builder;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { activities: data ?? [] },
    };
  },
});
