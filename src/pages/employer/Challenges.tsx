import Placeholder from "./Placeholder";
import { useTranslation } from "@/lib/i18n";

const Challenges = () => {
  const { t } = useTranslation();
  return (
    <Placeholder
      title={t("employerPanel.challenges.title") as string}
      description={t("employerPanel.challenges.description") as string}
      sections={[
        {
          title: t("employerPanel.challenges.sections.active.title") as string,
          body: t("employerPanel.challenges.sections.active.body") as string,
        },
        {
          title: t("employerPanel.challenges.sections.create.title") as string,
          body: t("employerPanel.challenges.sections.create.body") as string,
        },
        {
          title: t("employerPanel.challenges.sections.library.title") as string,
          body: t("employerPanel.challenges.sections.library.body") as string,
        },
        {
          title: t("employerPanel.challenges.sections.leaderboard.title") as string,
          body: t("employerPanel.challenges.sections.leaderboard.body") as string,
        },
      ]}
    />
  );
};
export default Challenges;
