import Placeholder from "./Placeholder";

const Surveys = () => (
  <Placeholder
    title="Surveys"
    description="Create pulse surveys and gather anonymous feedback from employees."
    sections={[
      { title: "Active Surveys", body: "Currently running surveys with response rates." },
      { title: "Draft Surveys", body: "Surveys prepared but not yet published." },
      { title: "Templates", body: "Ready-made survey templates: engagement, stress, remote work." },
      { title: "Results Archive", body: "Historical responses with export to CSV." },
    ]}
  />
);
export default Surveys;
