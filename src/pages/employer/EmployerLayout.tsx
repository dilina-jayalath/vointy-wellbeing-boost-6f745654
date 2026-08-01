import { Outlet, Link, useLocation } from "react-router-dom";
import { Bell, RefreshCw, User as UserIcon, Languages, Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EmployerSidebar } from "@/components/employer/EmployerSidebar";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";
import { useSubscription } from "@/hooks/useSubscription";
import EmployerPaywall from "@/components/employer/EmployerPaywall";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import vointyMark from "@/assets/vointy-mark.png.asset.json";


const EmployerLayout = () => {
  const { profile } = useAuth();
  const { orgName } = useEmployerOrg();
  const { pathname } = useLocation();
  const showBack = pathname !== "/employer";

  const { isActive, isTrialing, isPastDue, endsAt, loading } = useSubscription();
  // Billing page stays reachable without a plan so companies can subscribe.
  const isBillingPage = pathname.startsWith("/employer/subscriptions");
  const locked = !loading && !isActive && !isBillingPage;

  const daysLeft = endsAt
    ? Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 86400000))
    : null;
  const statusPill = loading
    ? "Checking plan…"
    : isTrialing && daysLeft !== null
      ? `Free trial remaining: ${daysLeft}d`
      : isPastDue
        ? "Payment failed"
        : isActive
          ? "Employer panel active"
          : "No active plan";




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
                  <span className="text-[9px] font-normal tracking-wide opacity-90">Build healthier habits, together.</span>
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
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <UserIcon className="h-4 w-4" />
              </div>
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
