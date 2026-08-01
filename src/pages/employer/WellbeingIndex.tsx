import Placeholder from "./Placeholder";
import { useTranslation } from "@/lib/i18n";

const ActivityIndex = () => {
  const { t } = useTranslation();
  return (
    <Placeholder
      title={t("employerPanel.wellbeingIndex.title") as string}
      description={t("employerPanel.wellbeingIndex.description") as string}
      sections={[
        {
          title: t("employerPanel.wellbeingIndex.sections.calculation.title") as string,
          body: t("employerPanel.wellbeingIndex.sections.calculation.body") as string,
        },
        {
          title: t("employerPanel.wellbeingIndex.sections.monthlyPoints.title") as string,
          body: t("employerPanel.wellbeingIndex.sections.monthlyPoints.body") as string,
        },
        {
          title: t("employerPanel.wellbeingIndex.sections.yearlyTotal.title") as string,
          body: t("employerPanel.wellbeingIndex.sections.yearlyTotal.body") as string,
        },
        {
          title: t("employerPanel.wellbeingIndex.sections.teamBreakdown.title") as string,
          body: t("employerPanel.wellbeingIndex.sections.teamBreakdown.body") as string,
        },
      ]}
    />
  );
};
export default ActivityIndex;
