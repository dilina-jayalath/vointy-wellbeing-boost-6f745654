import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MyActivities } from "@/components/app/MyActivities";
import { useTranslation } from "@/lib/i18n";

const EmployerActivities = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-purple">{t("employerPanel.activities.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("employerPanel.activities.description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("employerPanel.activities.yourActivities")}</CardTitle>
        </CardHeader>
        <CardContent>
          <MyActivities />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerActivities;
