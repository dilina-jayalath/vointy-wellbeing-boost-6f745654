import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation, languages } from "@/lib/i18n";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Seo from "@/components/Seo";

const Account = () => {
  const { user, profile, isAdmin, signOut, updateProfile, loading } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const appliedProfileLanguage = React.useRef(false);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name || "");
    // Apply the stored language only once, otherwise it would immediately
    // override any manual language change made on this page.
    if (!appliedProfileLanguage.current) {
      appliedProfileLanguage.current = true;
      if (profile.language && profile.language !== language) {
        setLanguage(profile.language as typeof language);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value as typeof language);
    if (user) {
      void updateProfile({ language: value });
    }
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await updateProfile({ display_name: displayName, language });
    setIsSaving(false);
    if (error) {
      toast({ title: t("errors.generic"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("account.saved") });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple-light to-white">
      <Header />
      <div className="py-24 px-4">
      <Seo
        title="Your account — Vointy.life"
        description="Manage your Vointy account: profile details, language preference and sign-in settings on vointy.life."
        path="/account"
        noindex
      />
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-6 grid gap-3 sm:grid-cols-2">
            <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark justify-start gap-2">
              <Link to="/app">
                <Smartphone className="h-4 w-4" />
                {t("navExtra.myVointy")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-2">
              <Link to="/employer">
                <Building2 className="h-4 w-4" />
                {t("navExtra.employerPanel")}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-display font-semibold leading-none tracking-tight">{t("account.title")}</h1>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">{t("account.displayName")}</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">{t("account.language")}</Label>
                <Select value={language} onValueChange={handleLanguageChange}>

                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="bg-brand-purple hover:bg-brand-purple-dark" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("account.save")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="font-medium">{t("auth.logout")}</p>
              <p className="text-sm text-muted-foreground">{t("accountPage.endSession")}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              {t("auth.logout")}
            </Button>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardContent className="py-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <p className="font-medium">{t("admin.title")}</p>
                <p className="text-sm text-muted-foreground">{t("accountPage.adminSubtitle")}</p>
              </div>
              <Button onClick={() => navigate("/admin")}>{t("nav.admin")}</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Account;
