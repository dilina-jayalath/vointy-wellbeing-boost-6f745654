import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import Seo from "@/components/Seo";
import Header from "@/components/Header";
import { Monitor, Smartphone, Chrome, Share2, ArrowDownCircle, CheckCircle2 } from "lucide-react";

const Download = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple-light to-white">
      <Header />
      <Seo
        title={t("download.metaTitle")}
        description={t("download.metaDescription")}
        path="/download"
      />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark">
              {t("download.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("download.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-brand-purple/10 rounded-lg">
                    <Monitor className="h-6 w-6 text-brand-purple" />
                  </div>
                  <CardTitle>{t("download.desktop.title")}</CardTitle>
                </div>
                <CardDescription>{t("download.desktop.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-3 text-sm text-muted-foreground list-decimal pl-4">
                  <li>{t("download.desktop.step1")}</li>
                  <li>{t("download.desktop.step2")}</li>
                  <li>{t("download.desktop.step3")}</li>
                </ol>
                <div className="flex items-center gap-2 text-sm text-brand-purple font-medium">
                  <Chrome className="h-4 w-4" />
                  {t("download.desktop.browsers")}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-brand-purple/10 rounded-lg">
                    <Smartphone className="h-6 w-6 text-brand-purple" />
                  </div>
                  <CardTitle>{t("download.mobile.title")}</CardTitle>
                </div>
                <CardDescription>{t("download.mobile.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <Share2 className="h-4 w-4 mt-0.5 text-brand-purple shrink-0" />
                    <span>{t("download.mobile.ios")}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ArrowDownCircle className="h-4 w-4 mt-0.5 text-brand-purple shrink-0" />
                    <span>{t("download.mobile.android")}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-brand-purple/20 bg-brand-purple/5">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{t("download.benefits.title")}</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-purple" /> {t("download.benefits.fast")}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-purple" /> {t("download.benefits.updates")}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-purple" /> {t("download.benefits.space")}</li>
                  </ul>
                </div>
                <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark">
                  <Link to="/signup">{t("download.cta")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Download;
