import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import vointyMark from "@/assets/vointy-mark.png.asset.json";
import LegalConsent from "@/components/auth/LegalConsent";
import PasswordInput from "@/components/auth/PasswordInput";
import Seo from '@/components/Seo';


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: t("auth.passwordMismatch"), variant: "destructive" });
      return;
    }
    if (!acceptedLegal) {
      toast({ title: t("legalConsent.required"), description: t("legalConsent.requiredDescription"), variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error, needsConfirmation } = await signUp(email, password);
    setIsLoading(false);
    if (error) {
      toast({ title: t("authPages.signUpFailed"), description: error.message, variant: "destructive" });
      return;
    }
    if (needsConfirmation) {
      toast({ title: t("authPages.checkYourEmail"), description: t("authPages.confirmationLinkSent") });
    }
    navigate("/login");
  };

  const handleGoogle = async () => {
    if (!acceptedLegal) {
      toast({ title: t("legalConsent.required"), description: t("legalConsent.requiredDescription"), variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    setIsLoading(false);
    if (error) {
      toast({ title: t("authPages.googleSignInFailed"), description: error.message, variant: "destructive" });
    }
  };

  const handleApple = async () => {
    if (!acceptedLegal) {
      toast({ title: t("legalConsent.required"), description: t("legalConsent.requiredDescription"), variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await signInWithApple();
    setIsLoading(false);
    if (error) {
      toast({ title: t("authPages.appleSignInFailed"), description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-brand-purple-light to-white">
      <Seo title="Sign up — Vointy.life" description="Create your free Vointy.life account and start building healthier habits with your team today." path="/signup" noindex />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={vointyMark.url} alt="Vointy logo" className="mx-auto mb-2 h-12 w-auto" />
          <p className="text-sm text-brand-purple font-medium tracking-wide mb-2">{t("authPages.slogan")}</p>
          <h1 className="text-2xl font-display font-semibold leading-none tracking-tight">{t("auth.signupTitle")}</h1>
          <CardDescription>{t("authPages.startMotivating")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <LegalConsent checked={acceptedLegal} onChange={setAcceptedLegal} />
            <Button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple-dark" disabled={isLoading || !acceptedLegal}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.signupButton")}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t("authPages.orContinueWith")}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleGoogle} disabled={isLoading}>
              {t("authPages.google")}
            </Button>
            <Button variant="outline" onClick={handleApple} disabled={isLoading}>
              {t("authPages.apple")}
            </Button>
          </div>

          <p className="text-center text-sm">
            {t("auth.hasAccount")}{" "}
            <Link to="/login" className="text-brand-purple hover:underline font-medium">
              {t("auth.logInNow")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
