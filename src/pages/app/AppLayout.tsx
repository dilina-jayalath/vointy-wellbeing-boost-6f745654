import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { Home, Activity, Trophy, Users, MessageSquare, BarChart3 as ActivityIcon2, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import BackButton from "@/components/BackButton";
import vointyMark from "@/assets/vointy-mark.png.asset.json";


const AppLayout = () => {
  const { profile } = useAuth();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const showBack = pathname !== "/app";

  const navItems = [
    { to: "/app", end: true, icon: Home, label: t("appPanel.nav.home") },
    { to: "/app/activities", icon: Activity, label: t("appPanel.nav.activities") },
    { to: "/app/challenges", icon: Trophy, label: t("appPanel.nav.challenges") },
    { to: "/app/community", icon: Users, label: t("appPanel.nav.community") },
    { to: "/app/chat", icon: MessageSquare, label: t("appPanel.nav.chat") },
    { to: "/app/wellbeing", icon: ActivityIcon2, label: t("appPanel.nav.index") },
  ];

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto w-full max-w-md min-h-screen bg-background flex flex-col shadow-xl">
        <header className="sticky top-0 z-20 bg-gradient-to-r from-brand-purple to-brand-blue text-primary-foreground px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {showBack && (
              <BackButton fallback="/app" className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground px-2" />
            )}
            <Link to="/app" className="font-bold text-lg flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
                <img src={vointyMark.url} alt="Vointy logo" className="h-5 w-auto" />
              </span>
              <div className="flex flex-col leading-none">
                <span>Vointy<span className="opacity-80">.life</span></span>
                <span className="text-[9px] font-normal tracking-wide opacity-90">{t("appPanel.nav.tagline")}</span>
              </div>
            </Link>

          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <NavLink
              to="/app/profile"
              className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden"
              aria-label={t("appPanel.nav.profileAria")}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-4 w-4" />
              )}
            </NavLink>
          </div>
        </header>

        <main className="flex-1 p-4 pb-24">
          <Outlet />
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-20 mx-auto w-full max-w-md border-t bg-background">
          <ul className="grid grid-cols-6">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 py-2 text-[11px] ${
                      isActive ? "text-brand-purple font-medium" : "text-muted-foreground"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
