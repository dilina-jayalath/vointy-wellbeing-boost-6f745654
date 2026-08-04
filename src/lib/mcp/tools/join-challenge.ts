import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "join_challenge",
  title: "Join a challenge",
  description: "Join a challenge as the signed-in user. Use list_challenges to find a challenge id.",
  inputSchema: {
    challenge_id: z.string().uuid().describe("Challenge id to join."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ challenge_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();

    const { data: existing, error: existingError } = await supabase
      .from("challenge_participants")
      .select("id,status,progress")
      .eq("challenge_id", challenge_id)
      .eq("user_id", userId)
      .maybeSingle();
    if (existingError) return { content: [{ type: "text", text: existingError.message }], isError: true };
    if (existing) {
      return {
        content: [{ type: "text", text: "Already joined this challenge." }],
        structuredContent: { participant: existing, already_joined: true },
      };
    }

    const { data, error } = await supabase
      .from("challenge_participants")
      .insert({ challenge_id, user_id: userId })
      .select("id,challenge_id,status,progress")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Joined challenge. ${JSON.stringify(data)}` }],
      structuredContent: { participant: data, already_joined: false },
    };
  },
});
