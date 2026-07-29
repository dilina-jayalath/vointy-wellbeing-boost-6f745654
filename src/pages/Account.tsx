import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n, languages } from "@/lib/i18n";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Account = () => {
  const { user, profile, isAdmin, signOut, updateProfile, loading } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      if (profile.language && profile.language !== language) {
        setLanguage(profile.language as typeof language);
      }
    }
  }, [profile, language, setLanguage]);

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
    <div className="min-h-screen py-24 px-4 bg-gradient-to-br from-brand-purple-light to-white">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display">{t("account.title")}</CardTitle>
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
                <Select value={language} onValueChange={(v) => setLanguage(v as typeof language)}>
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
              <p className="text-sm text-muted-foreground">End your session on this device.</p>
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
                <p className="text-sm text-muted-foreground">View contact submissions and newsletter subscribers.</p>
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
