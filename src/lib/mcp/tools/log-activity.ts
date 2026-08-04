import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "log_activity",
  title: "Log a performed activity",
  description:
    "Log a completed activity for the signed-in user. Each logged activity earns 1 Activity Index point.",
  inputSchema: {
    activity_id: z.string().uuid().describe("Activity id from search_activities."),
    amount: z.number().describe("Performed amount in the activity's unit (e.g. minutes)."),
    note: z.string().trim().describe("Optional note about the performance.").optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ activity_id, amount, note }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data: activity, error: activityError } = await supabase
      .from("activities")
      .select("id,unit")
      .eq("id", activity_id)
      .maybeSingle();
    if (activityError) return { content: [{ type: "text", text: activityError.message }], isError: true };
    if (!activity) return { content: [{ type: "text", text: "Activity not found" }], isError: true };

    const { data, error } = await supabase
      .from("performed_exercises")
      .insert({
        user_id: ctx.getUserId(),
        activity_id,
        amount,
        unit: activity.unit,
        note: note ?? null,
        points: 1,
      })
      .select("id,activity_id,amount,unit,points,performed_at")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Logged. ${JSON.stringify(data)}` }],
      structuredContent: { performed_exercise: data },
    };
  },
});
