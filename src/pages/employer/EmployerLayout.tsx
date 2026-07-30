import { Outlet, Link, useLocation } from "react-router-dom";
import { Bell, RefreshCw, User as UserIcon, Languages } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EmployerSidebar } from "@/components/employer/EmployerSidebar";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerOrg } from "@/hooks/useEmployerOrg";

const EmployerLayout = () => {
  const { profile } = useAuth();
  const { orgName } = useEmployerOrg();
  const { pathname } = useLocation();
  const showBack = pathname !== "/employer";


  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <EmployerSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-4 bg-gradient-to-r from-brand-purple to-brand-blue text-white">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-white hover:bg-white/10" />
              <Link to="/" className="text-lg font-bold ml-2 hidden sm:inline">
                Vointy<span className="opacity-80">.life</span>
              </Link>
              {orgName && <span className="hidden md:inline text-sm text-white/80 ml-3">{orgName}</span>}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                Free trial remaining: 30d and 23h
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

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EmployerLayout;
