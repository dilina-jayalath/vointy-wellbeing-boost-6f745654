import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_challenges",
  title: "List challenges",
  description:
    "List challenges visible to the signed-in user, optionally only the ones they have joined.",
  inputSchema: {
    joined_only: z.boolean().describe("When true, only challenges the user has joined.").optional(),
    limit: z.number().int().describe("Maximum number of challenges (default 20).").optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ joined_only, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const max = Math.min(Math.max(limit ?? 20, 1), 100);

    let joinedIds: string[] | null = null;
    if (joined_only) {
      const { data, error } = await supabase
        .from("challenge_participants")
        .select("challenge_id")
        .eq("user_id", ctx.getUserId());
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      joinedIds = (data ?? []).map((row) => row.challenge_id);
      if (joinedIds.length === 0) {
        return {
          content: [{ type: "text", text: "No joined challenges." }],
          structuredContent: { challenges: [] },
        };
      }
    }

    let builder = supabase
      .from("challenges")
      .select("id,title,description,challenge_type,status,start_date,end_date,target_value,unit")
      .order("start_date", { ascending: false })
      .limit(max);
    if (joinedIds) builder = builder.in("id", joinedIds);

    const { data, error } = await builder;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { challenges: data ?? [] },
    };
  },
});
