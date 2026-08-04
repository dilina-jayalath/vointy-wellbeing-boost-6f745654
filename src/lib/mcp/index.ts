import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchActivitiesTool from "./tools/search-activities";
import logActivityTool from "./tools/log-activity";
import getActivityIndexTool from "./tools/get-activity-index";
import listChallengesTool from "./tools/list-challenges";
import joinChallengeTool from "./tools/join-challenge";
import listCommunityPostsTool from "./tools/list-community-posts";
import createCommunityPostTool from "./tools/create-community-post";
import getMyProfileTool from "./tools/get-my-profile";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "vointy-wellbeing-boost",
  title: "vointy-wellbeing-boost",
  version: "0.1.0",
  instructions:
    "Tools for Vointy, a corporate wellbeing platform. Use search_activities and log_activity to record completed activities (1 point each), get_activity_index for the user's Activity Index, list_challenges/join_challenge for challenges, and list_community_posts/create_community_post for the community feed. All tools act as the signed-in Vointy user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    getMyProfileTool,
    searchActivitiesTool,
    logActivityTool,
    getActivityIndexTool,
    listChallengesTool,
    joinChallengeTool,
    listCommunityPostsTool,
    createCommunityPostTool,
  ],
});
