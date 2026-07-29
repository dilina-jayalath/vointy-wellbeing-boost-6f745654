import Placeholder from "./Placeholder";

const Challenges = () => (
  <Placeholder
    title="Challenges"
    description="Launch team challenges to boost activity, sleep, hydration and more."
    sections={[
      { title: "Active Challenges", body: "Ongoing challenges with participation and progress." },
      { title: "Create Challenge", body: "Set title, activity type, target, duration and teams." },
      { title: "Challenge Library", body: "Prebuilt challenges: 10k steps, water goal, mindfulness week." },
      { title: "Leaderboard", body: "Ranking of teams and individuals per challenge." },
    ]}
  />
);
export default Challenges;
