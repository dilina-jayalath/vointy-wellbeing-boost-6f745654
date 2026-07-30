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

const items = [
  { title: "Dashboard", url: "/employer", icon: LayoutDashboard, end: true },
  { title: "Activity Index", url: "/employer/wellbeing", icon: Building2 },
  { title: "Surveys", url: "/employer/surveys", icon: ClipboardList },
  { title: "Challenges", url: "/employer/challenges", icon: Trophy },
  { title: "Subscriptions", url: "/employer/subscriptions", icon: CreditCard },
  { title: "Invite Users", url: "/employer/invite", icon: UserPlus },
  { title: "Invited List", url: "/employer/invited", icon: MailCheck },
  { title: "Activate Users", url: "/employer/activate", icon: UserCheck },
  { title: "Teams", url: "/employer/teams", icon: Users },
];

export function EmployerSidebar() {
  const { pathname } = useLocation();
  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname === url || pathname.startsWith(url + "/");

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
