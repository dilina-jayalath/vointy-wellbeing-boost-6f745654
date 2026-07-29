import Placeholder from "./Placeholder";

const ActivateUsers = () => (
  <Placeholder
    title="Activate Users"
    description="Re-engage employees who have not been active recently."
    sections={[
      { title: "Inactive Users", body: "Employees with no activity in the last 14 days." },
      { title: "Send Reminder", body: "Trigger a friendly push / email reminder." },
      { title: "Activation Campaign", body: "Run a targeted campaign to bring users back." },
      { title: "History", body: "Past activation actions and their success rate." },
    ]}
  />
);
export default ActivateUsers;
