import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { Loader2, MailCheck, PartyPopper } from "lucide-react";

interface InviteInfo {
  organization_name: string;
  email: string;
  name: string | null;
  status: string;
}

const JoinCompany = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    supabase
      .rpc("invitation_info", { _token: token })
      .then(({ data }) => {
        const row = Array.isArray(data) ? (data[0] as InviteInfo | undefined) : undefined;
        setInfo(row ?? null);
        setName(row?.name ?? "");
        setLoading(false);
      });
  }, [token]);

  const accept = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("accept_invitation", { _token: token });
    setBusy(false);
    if (error) {
      toast({ title: t("joinCompany.couldNotJoin"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("joinCompany.welcomeTo").replace("{{name}}", info?.organization_name ?? "") });
    navigate("/app");
  };

  const signUpAndJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: t("joinCompany.passwordTooShort"), description: t("joinCompany.useAtLeast8Chars"), variant: "destructive" });
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: info!.email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/join?token=${token}`,
        data: { full_name: name },
      },
    });
    setBusy(false);
    if (error) {
      toast({ title: t("joinCompany.signUpFailed"), description: error.message, variant: "destructive" });
      return;
    }
    if (data.session) {
      await accept();
      return;
    }
    setSent(true);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  const invalid = !token || !info || info.status !== "pending";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-brand-purple-light to-white">
      <Card className="w-full max-w-md">
        {invalid ? (
          <CardContent className="p-10 text-center space-y-4">
            <h1 className="text-2xl font-bold text-brand-dark">{t("joinCompany.invitationNotValid")}</h1>
            <p className="text-gray-600">{t("joinCompany.invitationInvalidText")}</p>
            <Button asChild variant="outline">
              <Link to="/">{t("joinCompany.backToVointy")}</Link>
            </Button>
          </CardContent>
        ) : sent ? (
          <CardContent className="p-10 text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <MailCheck size={40} />
            </div>
            <h1 className="text-2xl font-bold text-brand-dark">{t("joinCompany.checkYourEmail")}</h1>
            <p className="text-gray-600">
              {t("joinCompany.confirmationSentTo").replace("{{email}}", info!.email).replace("{{organization}}", info!.organization_name)}
            </p>
          </CardContent>
        ) : (
          <>
            <CardHeader className="text-center">
              <div className="w-14 h-14 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center mx-auto mb-2">
                <PartyPopper size={26} />
              </div>
              <CardTitle className="text-2xl font-display">
                {t("joinCompany.invitedYou").replace("{{organization}}", info!.organization_name)}
              </CardTitle>
              <CardDescription>{info!.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <Button onClick={accept} disabled={busy} className="w-full bg-brand-purple hover:bg-brand-purple-dark">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("joinCompany.join").replace("{{organization}}", info!.organization_name)}
                </Button>
              ) : (
                <form onSubmit={signUpAndJoin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="join-name">{t("joinCompany.yourName")}</Label>
                    <Input id="join-name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="join-email">{t("joinCompany.email")}</Label>
                    <Input id="join-email" value={info!.email} readOnly disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="join-password">{t("joinCompany.choosePassword")}</Label>
                    <Input
                      id="join-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full bg-brand-purple hover:bg-brand-purple-dark">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("joinCompany.createAccountAndJoin")}
                  </Button>
                  <p className="text-center text-sm">
                    {t("joinCompany.alreadyHaveAccount")}{" "}
                    <Link to="/login" className="text-brand-purple hover:underline font-medium">
                      {t("joinCompany.logIn")}
                    </Link>{" "}
                    {t("joinCompany.andOpenLinkAgain")}
                  </p>
                </form>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default JoinCompany;
