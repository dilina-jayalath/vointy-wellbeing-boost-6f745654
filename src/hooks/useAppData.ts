import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useWellbeingScores = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["wellbeing-scores", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wellbeing_index_scores")
        .select("*")
        .order("recorded_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useActivities = () =>
  useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("is_active", true)
        .order("title");
      if (error) throw error;
      return data;
    },
  });

export const usePerformedExercises = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["performed-exercises", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("performed_exercises")
        .select("*, activities(title, icon, unit)")
        .order("performed_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });
};

export const useChallenges = () =>
  useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*, challenge_participants(id, user_id, progress, status)")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useOpenSurveys = () =>
  useQuery({
    queryKey: ["open-surveys"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wellbeing_surveys")
        .select("*, survey_questions(*)")
        .in("status", ["active", "published"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useCommunityFeed = () =>
  useQuery({
    queryKey: ["community-feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*, post_likes(id, user_id), post_comments(id, user_id, content, created_at)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

export const useActivityLog = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["activity-log", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("performed_exercises")
        .select("id, performed_at, activity_id, activities(title)")
        .order("performed_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};
