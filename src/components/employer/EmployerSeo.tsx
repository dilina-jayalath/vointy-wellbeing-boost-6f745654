import { useLocation } from "react-router-dom";
import Seo from "@/components/Seo";

type Meta = { title: string; description: string };

const META: Record<string, Meta> = {
  "/employer": {
    title: "Employer panel overview — Vointy.life",
    description:
      "Overview of your company's activity participation, teams and engagement inside the Vointy employer panel.",
  },
  "/employer/wellbeing": {
    title: "Wellbeing reporting — Vointy employer panel",
    description:
      "Follow how your teams' Activity Index develops month by month and spot wellbeing trends early.",
  },
  "/employer/activity-summary": {
    title: "Activity summary — Vointy employer panel",
    description:
      "Summary of completed activities, points and participation rates across every team in your company.",
  },
  "/employer/engagement": {
    title: "Engagement & community — Vointy employer panel",
    description:
      "See how employees interact, comment and take part in shared activities and community challenges.",
  },
  "/employer/roi": {
    title: "Administration & ROI — Vointy employer panel",
    description:
      "Compare uploaded sick leave data against activity data to estimate the return on your wellbeing programme.",
  },
  "/employer/predictive": {
    title: "Predictive analytics — Vointy employer panel",
    description:
      "Forecast future activity levels and participation risks so you can act before engagement drops.",
  },
  "/employer/activities": {
    title: "Manage activities — Vointy employer panel",
    description:
      "Browse the Vointy activity archive and create your own company activities for your teams.",
  },
  "/employer/surveys": {
    title: "Surveys — Vointy employer panel",
    description:
      "Create and follow employee wellbeing surveys and review the answers by team inside Vointy.",
  },
  "/employer/challenges": {
    title: "Challenges & campaigns — Vointy employer panel",
    description:
      "Launch team challenges and wellbeing campaigns and follow how employees take part in them.",
  },
  "/employer/subscriptions": {
    title: "Billing & subscription — Vointy employer panel",
    description:
      "Manage your €149/month Employer panel subscription, invoices and billing details for your company.",
  },
  "/employer/invite": {
    title: "Invite employees — Vointy employer panel",
    description:
      "Send email invitations so your employees can join Vointy and start collecting activity points.",
  },
  "/employer/invited": {
    title: "Invited employees — Vointy employer panel",
    description:
      "Review every sent invitation, its status and which employees have already joined Vointy.",
  },
  "/employer/activate": {
    title: "Activate users — Vointy employer panel",
    description:
      "Activate or deactivate employee accounts and keep your company's user list up to date.",
  },
  "/employer/teams": {
    title: "Teams — Vointy employer panel",
    description:
      "Create unlimited teams, assign employees and organise team-based access inside Vointy.",
  },
};

const FALLBACK: Meta = {
  title: "Employer panel — Vointy.life",
  description:
    "Vointy employer panel: manage teams, invite employees and follow wellbeing analytics for your company.",
};

const EmployerSeo = () => {
  const { pathname } = useLocation();
  const key = pathname.replace(/\/+$/, "") || "/employer";
  const meta = META[key] ?? FALLBACK;
  return (
    <Seo title={meta.title} description={meta.description} path={key} noindex />
  );
};

export default EmployerSeo;
