import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { Home, Activity, Trophy, Users, BarChart3 as ActivityIcon2, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import BackButton from "@/components/BackButton";
import vointyMark from "@/assets/vointy-mark.png.asset.json";


const navItems = [
  { to: "/app", end: true, icon: Home, label: "Home" },
  { to: "/app/activities", icon: Activity, label: "Activities" },
  { to: "/app/challenges", icon: Trophy, label: "Challenges" },
  { to: "/app/community", icon: Users, label: "Community" },
  { to: "/app/wellbeing", icon: ActivityIcon2, label: "Index" },
];

const AppLayout = () => {
  const { profile } = useAuth();
  const { pathname } = useLocation();
  const showBack = pathname !== "/app";


  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto w-full max-w-md min-h-screen bg-background flex flex-col shadow-xl">
        <header className="sticky top-0 z-20 bg-gradient-to-r from-brand-purple to-brand-blue text-primary-foreground px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {showBack && (
              <BackButton fallback="/app" className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground px-2" />
            )}
            <Link to="/app" className="font-bold text-lg">
              Vointy<span className="opacity-80">.life</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <NavLink
              to="/app/profile"
              className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden"
              aria-label="Profile"
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
          <ul className="grid grid-cols-5">
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
