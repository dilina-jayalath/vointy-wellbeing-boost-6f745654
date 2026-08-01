import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/lib/i18n";
import Index from "./pages/Index";
import Subscription from "./pages/Subscription";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import ContactForm from "./pages/ContactForm";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import RefundPolicy from "./pages/RefundPolicy";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import CompanySignup from "./pages/CompanySignup";
import JoinCompany from "./pages/JoinCompany";
import Unsubscribe from "./pages/Unsubscribe";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployerLayout from "./pages/employer/EmployerLayout";
import EmployerDashboard from "./pages/employer/Dashboard";
import EmployerWellbeing from "./pages/employer/WellbeingIndex";
import EmployerActivitySummary from "./pages/employer/ActivitySummary";
import EmployerEngagement from "./pages/employer/Engagement";
import EmployerWellbeingReport from "./pages/employer/Wellbeing";
import EmployerSurveys from "./pages/employer/Surveys";
import EmployerChallenges from "./pages/employer/Challenges";
import EmployerSubscriptions from "./pages/employer/Subscriptions";
import EmployerInvite from "./pages/employer/InviteUsers";
import EmployerInvitedList from "./pages/employer/InvitedList";
import EmployerActivate from "./pages/employer/ActivateUsers";
import EmployerTeams from "./pages/employer/Teams";
import EmployerActivities from "./pages/employer/Activities";
import AppLayout from "./pages/app/AppLayout";
import AppHome from "./pages/app/Home";
import AppActivities from "./pages/app/Activities";
import AppChallenges from "./pages/app/Challenges";
import AppCommunity from "./pages/app/Community";
import AppWellbeing from "./pages/app/Wellbeing";
import AppProfile from "./pages/app/Profile";
import NotFound from "./pages/NotFound";
import PageViewTracker from "./components/PageViewTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageViewTracker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contact-form" element={<ContactForm />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/company-signup" element={<CompanySignup />} />
              <Route path="/join" element={<JoinCompany />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer"
                element={
                  <ProtectedRoute>
                    <EmployerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<EmployerDashboard />} />
                <Route path="wellbeing" element={<EmployerWellbeing />} />
                <Route path="activity-summary" element={<EmployerActivitySummary />} />
                <Route path="engagement" element={<EmployerEngagement />} />
                <Route path="wellbeing-report" element={<EmployerWellbeingReport />} />
                <Route path="activities" element={<EmployerActivities />} />
                <Route path="surveys" element={<EmployerSurveys />} />
                <Route path="challenges" element={<EmployerChallenges />} />
                <Route path="subscriptions" element={<EmployerSubscriptions />} />
                <Route path="invite" element={<EmployerInvite />} />
                <Route path="invited" element={<EmployerInvitedList />} />
                <Route path="activate" element={<EmployerActivate />} />
                <Route path="teams" element={<EmployerTeams />} />
              </Route>
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AppHome />} />
                <Route path="activities" element={<AppActivities />} />
                <Route path="challenges" element={<AppChallenges />} />
                <Route path="community" element={<AppCommunity />} />
                <Route path="wellbeing" element={<AppWellbeing />} />
                <Route path="profile" element={<AppProfile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
