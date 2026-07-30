import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "vointy_session_id";

const getSessionId = () => {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
};

/** Logs every route change so the admin panel can show site usage analytics. */
const PageViewTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const log = async () => {
      const { data } = await supabase.auth.getSession();
      await supabase.from("page_views").insert({
        path: pathname,
        session_id: getSessionId(),
        referrer: document.referrer || null,
        user_id: data.session?.user.id ?? null,
      });
    };
    log().catch(() => {
      /* analytics must never break the app */
    });
  }, [pathname]);

  return null;
};

export default PageViewTracker;
