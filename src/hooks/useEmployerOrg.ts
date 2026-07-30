import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Makes sure the signed-in employer has an organization.
 * Creates one from the company name given at registration if missing.
 */
export const useEmployerOrg = () => {
  const { user } = useAuth();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const ensure = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile?.organization_id) {
      const { data: org } = await supabase
        .from("organizations")
        .select("id, name")
        .eq("id", profile.organization_id)
        .maybeSingle();
      setOrgId(org?.id ?? profile.organization_id);
      setOrgName(org?.name ?? null);
      setLoading(false);
      return;
    }

    // Fall back to an organization this user already created
    const { data: ownOrg } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("created_by", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (ownOrg) {
      await supabase
        .from("profiles")
        .update({ organization_id: ownOrg.id })
        .eq("user_id", user.id);
      setOrgId(ownOrg.id);
      setOrgName(ownOrg.name);
      setLoading(false);
      return;
    }

    const companyName =
      (user.user_metadata?.company_name as string | undefined)?.trim() ||
      `${user.email?.split("@")[0] ?? "My"} company`;

    const { data: created, error } = await supabase
      .from("organizations")
      .insert({ name: companyName, created_by: user.id })
      .select("id, name")
      .single();

    if (error || !created) {
      console.error("Failed to create organization", error);
      setLoading(false);
      return;
    }

    await supabase
      .from("profiles")
      .update({ organization_id: created.id })
      .eq("user_id", user.id);

    setOrgId(created.id);
    setOrgName(created.name);
    setLoading(false);

  }, [user]);

  useEffect(() => {
    ensure();
  }, [ensure]);

  return { orgId, orgName, loading, refresh: ensure };
};
