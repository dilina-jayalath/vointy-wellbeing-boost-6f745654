import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getPaddleEnvironment } from "@/lib/paddle";

export interface SubscriptionRow {
  id: string;
  paddle_subscription_id: string;
  product_id: string;
  price_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  organization_id: string | null;
}

const ACTIVE_STATUSES = ["active", "trialing", "past_due"];

/**
 * Reads the current Employer Dashboard subscription for the signed-in user or
 * their organization. Access rules:
 *  - active / trialing / past_due  -> full access
 *  - canceled                      -> access until current_period_end
 */
export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    setLoading(true);

    // RLS already limits rows to the user's own or their organization's subscription.
    const { data } = await supabase
      .from("subscriptions")
      .select(
        "id, paddle_subscription_id, product_id, price_id, status, current_period_start, current_period_end, cancel_at_period_end, organization_id",
      )
      .eq("environment", getPaddleEnvironment())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setSubscription((data as SubscriptionRow) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("subscriptions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, load]);

  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null;
  const periodActive = !periodEnd || periodEnd.getTime() > Date.now();

  const isActive = !!subscription &&
    ((ACTIVE_STATUSES.includes(subscription.status) && periodActive) ||
      (subscription.status === "canceled" && !!periodEnd && periodEnd.getTime() > Date.now()));

  return {
    subscription,
    loading,
    isActive,
    isTrialing: subscription?.status === "trialing" && periodActive,
    isPastDue: subscription?.status === "past_due",
    endsAt: periodEnd,
    refresh: load,
  };
}
