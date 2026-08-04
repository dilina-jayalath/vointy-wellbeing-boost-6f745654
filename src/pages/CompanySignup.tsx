import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import vointyMark from "@/assets/vointy-mark.png.asset.json";
import { useTranslation } from "@/lib/i18n";
import LegalConsent from "@/components/auth/LegalConsent";
import PasswordInput from "@/components/auth/PasswordInput";

import { CheckCircle2, Loader2, MailCheck } from "lucide-react";
import Seo from '@/components/Seo';

const CompanySignup = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const perks = [
    t("companySignup.perkUnlimitedEmployees"),
    t("companySignup.perkUnlimitedTeams"),
    t("companySignup.perkAllActivities"),
    t("companySignup.perkNoPerUserFees"),
  ];

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast({ title: t("companySignup.passwordTooShort"), description: t("companySignup.useAtLeast8Chars"), variant: "destructive" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: t("auth.passwordMismatch"), variant: "destructive" });
      return;
    }
    if (!acceptedLegal) {
      toast({ title: t("legalConsent.required"), description: t("legalConsent.requiredDescription"), variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/employer`,
        data: {
          full_name: form.contactName.trim(),
          company_name: form.companyName.trim(),
          account_type: "employer",
        },
      },
    });
    setIsLoading(false);
    if (error) {
      toast({ title: t("companySignup.registrationFailed"), description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Seo title="Company sign up — Vointy.life" description="Register your company on Vointy.life for free: unlimited teams, 158 activities and healthier habits for your employees." path="/company-signup" />
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <img src={vointyMark.url} alt="Vointy logo" className="h-14 w-auto mb-2" />
              <p className="text-sm text-brand-purple font-medium tracking-wide mb-4">{t("authPages.slogan")}</p>
              <h1 className="text-4xl md:text-5xl font-bold font-display text-brand-dark mb-4 leading-tight">
                {t("companySignup.headingPre")} <span className="gradient-text">{t("companySignup.headingFree")}</span> {t("companySignup.headingPost")}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {t("companySignup.description")}
              </p>
              <ul className="space-y-3">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-brand-purple flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-8">
                {t("companySignup.needAnalytics")}{" "}
                <Link to="/subscription" className="text-brand-purple font-medium hover:underline">
                  {t("companySignup.seeEmployerDashboard")}
                </Link>
              </p>
            </div>

            {done ? (
              <Card className="shadow-xl border-none">
                <CardContent className="p-10 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <MailCheck size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-dark">{t("companySignup.checkYourEmail")}</h2>
                  <p className="text-gray-600">
                    {t("companySignup.confirmationSentTo").replace("{{email}}", form.email)}
                  </p>
                  <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark">
                    <Link to="/login">{t("companySignup.goToLogin")}</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-2xl border-none overflow-hidden">
                <CardHeader className="bg-brand-purple text-white p-8">
                  <CardTitle className="text-2xl">{t("companySignup.createYourCompanyAccount")}</CardTitle>
                  <CardDescription className="text-white/80">
                    {t("companySignup.freeForever")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">{t("companySignup.companyName")}</Label>
                      <Input id="companyName" name="companyName" value={form.companyName} onChange={onChange} required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">{t("companySignup.contactPerson")}</Label>
                      <Input id="contactName" name="contactName" value={form.contactName} onChange={onChange} required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("companySignup.workEmail")}</Label>
                      <Input id="email" name="email" type="email" value={form.email} onChange={onChange} required className="h-12" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">{t("companySignup.password")}</Label>
                        <PasswordInput id="password" name="password" value={form.password} onChange={onChange} required className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t("companySignup.confirmPassword")}</Label>
                        <PasswordInput id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={onChange} required className="h-12" />
                      </div>
                    </div>
                    <LegalConsent checked={acceptedLegal} onChange={setAcceptedLegal} id="company-legal-consent" />
                    <Button type="submit" className="w-full btn-primary h-12 text-lg font-bold" disabled={isLoading || !acceptedLegal}>
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : t("companySignup.createFreeAccount")}
                    </Button>
                    <p className="text-sm text-gray-500 text-center">
                      {t("companySignup.alreadyRegistered")}{" "}
                      <Link to="/login" className="text-brand-purple hover:underline">{t("companySignup.logIn")}</Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanySignup;
