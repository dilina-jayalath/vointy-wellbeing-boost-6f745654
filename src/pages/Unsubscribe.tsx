import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";
import { Loader2, MailX, CheckCircle2, AlertTriangle } from "lucide-react";
import Seo from '@/components/Seo';

type State = "loading" | "valid" | "already" | "invalid" | "done" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    const check = async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_KEY } }
        );
        const data = await res.json();
        if (data?.valid) setState("valid");
        else if (data?.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch {
        setState("error");
      }
    };
    check();
  }, [token]);

  const confirm = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    setBusy(false);
    if (error) {
      setState("error");
      return;
    }
    if (data?.success) setState("done");
    else if (data?.reason === "already_unsubscribed") setState("already");
    else setState("error");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-brand-purple-light to-white">
      <Seo title="Unsubscribe — Vointy.life" description="Manage your Vointy.life newsletter subscription and unsubscribe from wellbeing updates at any time." path="/unsubscribe" noindex />
      <Card className="w-full max-w-md">
        <CardContent className="p-10 text-center space-y-4">
          {state === "loading" && (
            <Loader2 className="h-8 w-8 animate-spin text-brand-purple mx-auto" />
          )}

          {state === "valid" && (
            <>
              <div className="w-16 h-16 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center mx-auto">
                <MailX size={30} />
              </div>
              <h1 className="text-2xl font-bold text-brand-dark">{t("unsubscribe.heading")}</h1>
              <p className="text-muted-foreground">
                {t("unsubscribe.description")}
              </p>
              <Button
                onClick={confirm}
                disabled={busy}
                className="w-full bg-brand-purple hover:bg-brand-purple-dark"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("unsubscribe.confirmButton")}
              </Button>
            </>
          )}

          {state === "done" && (
            <>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={30} />
              </div>
              <h1 className="text-2xl font-bold text-brand-dark">{t("unsubscribe.doneHeading")}</h1>
              <p className="text-muted-foreground">{t("unsubscribe.doneDescription")}</p>
              <Button asChild variant="outline">
                <Link to="/">{t("unsubscribe.backToVointy")}</Link>
              </Button>
            </>
          )}

          {state === "already" && (
            <>
              <h1 className="text-2xl font-bold text-brand-dark">{t("unsubscribe.alreadyHeading")}</h1>
              <p className="text-muted-foreground">{t("unsubscribe.alreadyDescription")}</p>
              <Button asChild variant="outline">
                <Link to="/">{t("unsubscribe.backToVointy")}</Link>
              </Button>
            </>
          )}

          {(state === "invalid" || state === "error") && (
            <>
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={30} />
              </div>
              <h1 className="text-2xl font-bold text-brand-dark">{t("unsubscribe.invalidHeading")}</h1>
              <p className="text-muted-foreground">
                {t("unsubscribe.invalidDescription")}
              </p>
              <Button asChild variant="outline">
                <Link to="/">{t("unsubscribe.backToVointy")}</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
