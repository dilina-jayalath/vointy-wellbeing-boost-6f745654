import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { Backdrop } from "./components/Backdrop";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneFree } from "./scenes/SceneFree";
import { SceneActivities } from "./scenes/SceneActivities";
import { SceneIndex } from "./scenes/SceneIndex";
import { SceneOutro } from "./scenes/SceneOutro";

const timing = springTiming({ config: { damping: 200 }, durationInFrames: 20 });

export const MainVideo: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={75}>
        <SceneIntro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={90}>
        <SceneFree />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={100}>
        <SceneActivities />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={100}>
        <SceneIndex />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={90}>
        <SceneOutro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
