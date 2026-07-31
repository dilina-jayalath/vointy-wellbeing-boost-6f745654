import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C } from "../theme";
import { display, mono } from "../fonts";
import { Kicker } from "../components/Kicker";

const WORD = "VOINTY";

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ padding: "110px 140px", justifyContent: "center" }}>
      <div style={{ marginBottom: 46 }}>
        <Kicker index="01" label="Corporate wellbeing" fontFamily={mono} />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {WORD.split("").map((ch, i) => {
          const s = spring({ frame: frame - 8 - i * 4, fps, config: { damping: 18, stiffness: 140 } });
          const y = interpolate(s, [0, 1], [140, 0]);
          const blur = interpolate(s, [0, 1], [14, 0]);
          return (
            <span
              key={i}
              style={{
                fontFamily: display,
                fontWeight: 700,
                fontSize: 220,
                lineHeight: 1,
                letterSpacing: -8,
                color: i > 3 ? C.purple : C.cream,
                transform: `translateY(${y}px)`,
                filter: `blur(${blur}px)`,
                opacity: s,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 34,
          fontFamily: display,
          fontWeight: 300,
          fontSize: 46,
          color: C.cream,
          opacity: interpolate(frame, [40, 60], [0, 0.85], { extrapolateRight: "clamp" }),
          transform: `translateX(${interpolate(frame, [40, 70], [40, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        Healthier teams. Fewer sick days.
      </div>
    </AbsoluteFill>
  );
};
