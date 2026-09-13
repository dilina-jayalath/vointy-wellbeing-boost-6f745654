import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import InstallAppPrompt from "@/components/InstallAppPrompt";
import { LayoutDashboard, UserPlus, MailCheck, Users, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";
import { useTranslation } from "@/lib/i18n";
import vointyMark from "@/assets/vointy-mark.png.asset.json";

const CompanyLayout = () => {
  const { user, signOut } = useAuth();
  const { orgName } = useEmployerOrg();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const items = [
    { to: "/company", end: true, icon: LayoutDashboard, label: t("companyWorkspace.nav.overview") },
    { to: "/company/invite", icon: UserPlus, label: t("companyWorkspace.nav.invite") },
    { to: "/company/invited", icon: MailCheck, label: t("companyWorkspace.nav.invited") },
    { to: "/company/teams", icon: Users, label: t("companyWorkspace.nav.teams") },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-gradient-to-r from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
              <img src={vointyMark.url} alt="Vointy logo" className="h-5 w-auto" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-bold">Vointy<span className="opacity-80">.life</span></span>
              <span className="text-[9px] tracking-wide opacity-90">Build healthier habits, together.</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {orgName && <span className="hidden md:inline text-sm text-white/85 mr-2">{orgName}</span>}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 gap-1"
              onClick={async () => {
                await signOut();
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <nav className="container mx-auto px-4 flex gap-1 overflow-x-auto">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 text-sm rounded-t-md whitespace-nowrap ${
                  isActive ? "bg-slate-50 text-brand-purple font-medium" : "text-white/90 hover:bg-white/10"
                }`
              }
            >
              <i.icon className="h-4 w-4" /> {i.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <InstallAppPrompt variant="card" storageKey="vointy-install-dismissed-company" />

        <Outlet />

        <div className="rounded-lg border bg-white p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex gap-3">
            <Lock className="h-5 w-5 text-brand-purple shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-brand-dark">{t("companyWorkspace.upsell.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("companyWorkspace.upsell.description")}</p>
            </div>
          </div>
          <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark shrink-0">
            <Link to="/subscription">{t("companyWorkspace.upsell.cta")}</Link>
          </Button>
        </div>
        {!user && null}
      </main>
    </div>
  );
};

export default CompanyLayout;
