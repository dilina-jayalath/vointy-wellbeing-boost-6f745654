import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_activity_index",
  title: "Get my Activity Index",
  description:
    "Return the signed-in user's Activity Index: total points and points per month for the current calendar year. Every logged activity is worth 1 point.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const year = new Date().getUTCFullYear();
    const { data, error } = await supabase
      .from("performed_exercises")
      .select("points,performed_at")
      .eq("user_id", ctx.getUserId())
      .gte("performed_at", `${year}-01-01`)
      .order("performed_at", { ascending: true });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const monthly = Array.from({ length: 12 }, () => 0);
    let total = 0;
    for (const row of data ?? []) {
      const month = new Date(row.performed_at).getUTCMonth();
      const points = row.points ?? 1;
      monthly[month] += points;
      total += points;
    }
    const summary = { year, total_points: total, monthly_points: monthly };
    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: summary,
    };
  },
});
