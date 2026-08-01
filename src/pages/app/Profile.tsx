import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation, languages, Language } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { LogOut, User as UserIcon } from "lucide-react";

const AppProfile = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      display_name: displayName,
      avatar_url: avatarUrl || null,
      language,
    });
    setSaving(false);
    if (error) {
      toast({ title: t("appPanel.profile.toast.couldNotSave"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("appPanel.profile.toast.updated") });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("appPanel.profile.title")}</h1>

      <Card>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={t("appPanel.profile.profilePictureAlt")} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-7 w-7 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{profile?.display_name ?? t("appPanel.profile.defaultName")}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("appPanel.profile.settings")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="name">{t("appPanel.profile.displayName")}</Label>
            <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="avatar">{t("appPanel.profile.avatarUrl")}</Label>
            <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </div>
          <div>
            <Label>{t("appPanel.profile.language")}</Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.flag} {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={save} disabled={saving}>
            {saving ? t("appPanel.profile.saving") : t("appPanel.profile.save")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <Button asChild variant="outline" className="w-full">
            <Link to="/employer">{t("appPanel.profile.employerPanel")}</Link>
          </Button>
          <Button variant="ghost" className="w-full text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> {t("appPanel.profile.signOut")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppProfile;
