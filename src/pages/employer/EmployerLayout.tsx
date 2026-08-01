import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, RefreshCw, User as UserIcon, Languages, Loader2, CreditCard, LogOut } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EmployerSidebar } from "@/components/employer/EmployerSidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BackButton from "@/components/BackButton";

import { useAuth } from "@/contexts/AuthContext";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";
import { useSubscription } from "@/hooks/useSubscription";
import EmployerPaywall from "@/components/employer/EmployerPaywall";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import vointyMark from "@/assets/vointy-mark.png.asset.json";
import { useTranslation } from "@/lib/i18n";


const EmployerLayout = () => {
  const { profile, isAdmin } = useAuth();
  const { orgName } = useEmployerOrg();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const showBack = pathname !== "/employer";

  const { isActive, isTrialing, isPastDue, endsAt, loading } = useSubscription();
  // Billing page stays reachable without a plan so companies can subscribe.
  const isBillingPage = pathname.startsWith("/employer/subscriptions");
  // Platform admins can review the panel (incl. analytics) without a paid plan.
  const locked = !loading && !isActive && !isBillingPage && !isAdmin;

  const daysLeft = endsAt
    ? Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 86400000))
    : null;
  const statusPill = loading
    ? t("employerPanel.layout.checkingPlan")
    : isTrialing && daysLeft !== null
      ? (t("employerPanel.layout.trialRemaining") as string).replace("{days}", String(daysLeft))
      : isPastDue
        ? t("employerPanel.layout.paymentFailed")
        : isActive
          ? t("employerPanel.layout.panelActive")
          : t("employerPanel.layout.noActivePlan");




  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <EmployerSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-4 bg-gradient-to-r from-brand-purple to-brand-blue text-white">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-white hover:bg-white/10" />
              {showBack && (
                <BackButton fallback="/employer" className="text-white hover:bg-white/10 hover:text-white px-2" />
              )}
              <Link to="/" className="text-lg font-bold ml-2 hidden sm:flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
                  <img src={vointyMark.url} alt="Vointy logo" className="h-5 w-auto" />
                </span>
                <div className="flex flex-col leading-none">
                  <span>Vointy<span className="opacity-80">.life</span></span>
                  <span className="text-[9px] font-normal tracking-wide opacity-90">{t("employerPanel.layout.brandTagline")}</span>
                </div>
              </Link>


              {orgName && <span className="hidden md:inline text-sm text-white/80 ml-3">{orgName}</span>}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    isActive && !isPastDue ? "bg-green-400" : "bg-orange-300"
                  }`}
                />
                {statusPill}
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 gap-1">
                <Languages className="h-4 w-4" /> EN
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <RefreshCw className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Profile menu"
                    className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/60"
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile avatar" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-4 w-4" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background z-50">
                  <DropdownMenuLabel className="truncate">
                    {profile?.display_name || user?.email || "Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/app/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/employer/subscriptions" className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" /> Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      navigate("/auth");
                    }}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </header>

          <PaymentTestModeBanner />

          <main className="flex-1 p-6">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-brand-purple" />
              </div>
            ) : locked ? (
              <EmployerPaywall />
            ) : (
              <Outlet />
            )}
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
};

export default EmployerLayout;
