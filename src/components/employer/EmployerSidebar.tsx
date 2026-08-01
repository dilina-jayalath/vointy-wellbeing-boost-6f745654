import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Trophy,
  CreditCard,
  UserPlus,
  UserCheck,
  Users,
  MailCheck,
  Dumbbell,
  BarChart3,
  Heart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslation } from "@/lib/i18n";

export function EmployerSidebar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const items = [
    { title: t("employerPanel.sidebar.dashboard"), url: "/employer", icon: LayoutDashboard, end: true },
    { title: t("employerPanel.sidebar.activityIndex"), url: "/employer/wellbeing", icon: Building2 },
    { title: t("employerPanel.sidebar.activitySummary"), url: "/employer/activity-summary", icon: BarChart3 },
    { title: t("employerPanel.sidebar.engagement"), url: "/employer/engagement", icon: Heart },
    { title: t("employerPanel.sidebar.activities"), url: "/employer/activities", icon: Dumbbell },
    { title: t("employerPanel.sidebar.surveys"), url: "/employer/surveys", icon: ClipboardList },
    { title: t("employerPanel.sidebar.challenges"), url: "/employer/challenges", icon: Trophy },
    { title: t("employerPanel.sidebar.subscriptions"), url: "/employer/subscriptions", icon: CreditCard },
    { title: t("employerPanel.sidebar.inviteUsers"), url: "/employer/invite", icon: UserPlus },
    { title: t("employerPanel.sidebar.invitedList"), url: "/employer/invited", icon: MailCheck },
    { title: t("employerPanel.sidebar.activateUsers"), url: "/employer/activate", icon: UserCheck },
    { title: t("employerPanel.sidebar.teams"), url: "/employer/teams", icon: Users },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-brand-purple to-brand-blue text-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url, item.end)}
                    className="text-white/90 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white"
                  >
                    <NavLink to={item.url} end={item.end} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
