import { supabase } from "@/integrations/supabase/client";

/**
 * Where a freshly signed-in user should land.
 * Company accounts (those who registered a company or own an organization)
 * go to the free company workspace, everyone else to the employee app.
 */
export const landingRoute = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return "/app";

  if ((user.user_metadata?.account_type as string | undefined) === "employer") return "/company";

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("created_by", user.id)
    .limit(1)
    .maybeSingle();

  return org ? "/company" : "/app";
};
