import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Contact = Database["public"]["Tables"]["contact_submissions"]["Row"];
type Subscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];

const AdminDashboard = () => {
  const { t } = useI18n();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: cData }, { data: sData }] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
      ]);
      setContacts(cData || []);
      setSubscribers(sData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 bg-gradient-to-br from-brand-purple-light to-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-display mb-8">{t("admin.title")}</h1>
        <Tabs defaultValue="contacts">
          <TabsList>
            <TabsTrigger value="contacts">{t("admin.contacts")} ({contacts.length})</TabsTrigger>
            <TabsTrigger value="subscribers">{t("admin.subscribers")} ({subscribers.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="contacts" className="space-y-4 mt-4">
            {contacts.length === 0 ? (
              <p className="text-muted-foreground">{t("admin.noContacts")}</p>
            ) : (
              contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{contact.subject}</CardTitle>
                    <CardDescription>
                      {contact.first_name} {contact.last_name} — {contact.email}
                      {contact.company_name && ` · ${contact.company_name}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
                    <p className="text-xs text-muted-foreground mt-4">
                      {new Date(contact.created_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          <TabsContent value="subscribers" className="space-y-4 mt-4">
            {subscribers.length === 0 ? (
              <p className="text-muted-foreground">{t("admin.noSubscribers")}</p>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {subscribers.map((sub) => (
                      <li key={sub.id} className="px-6 py-4 flex justify-between items-center">
                        <span>{sub.email}</span>
                        <span className="text-xs text-muted-foreground uppercase">{sub.language}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
