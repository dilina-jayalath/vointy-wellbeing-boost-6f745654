import Placeholder from "./Placeholder";

const WellbeingIndex = () => (
  <Placeholder
    title="Wellbeing Index"
    description="Track how your organisation's wellbeing evolves over time."
    sections={[
      { title: "Overall Index", body: "Aggregate wellbeing score across all active teams and employees." },
      { title: "Trend", body: "Monthly and quarterly comparison of the wellbeing index." },
      { title: "Team Breakdown", body: "Per-team wellbeing score with drill-down." },
      { title: "Recommendations", body: "Automated suggestions to raise the index." },
    ]}
  />
);
export default WellbeingIndex;
