import Placeholder from "./Placeholder";

const ActivityIndex = () => (
  <Placeholder
    title="Activity Index"
    description="Track how active your organisation is over time."
    sections={[
      {
        title: "How it is calculated",
        body: "Every completed activity gives an employee 1 point. Points are summed per month and accumulated over the membership year that starts when the employee joins.",
      },
      { title: "Monthly points", body: "Total activity points per month across all active teams and employees." },
      { title: "Yearly total", body: "Accumulated points per employee since they joined." },
      { title: "Team Breakdown", body: "Per-team activity points with drill-down." },
    ]}
  />
);
export default ActivityIndex;
