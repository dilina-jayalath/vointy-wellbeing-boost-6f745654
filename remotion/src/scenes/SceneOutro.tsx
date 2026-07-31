import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C } from "../theme";
import { display, mono } from "../fonts";

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const line = interpolate(frame, [18, 52], [0, 720], { extrapolateRight: "clamp" });
  const float = Math.sin(frame / 34) * 6;

  return (
    <AbsoluteFill style={{ padding: "140px", justifyContent: "center", alignItems: "flex-start" }}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 22,
          letterSpacing: 8,
          color: C.blue,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Free 30-day trial · Employer panel €149/mo
      </div>
      <div
        style={{
          marginTop: 40,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 190,
          letterSpacing: -9,
          color: C.cream,
          opacity: s,
          transform: `translateY(${interpolate(s, [0, 1], [70, 0]) + float}px)`,
        }}
      >
        vointy<span style={{ color: C.purple }}>.life</span>
      </div>
      <div style={{ width: line, height: 2, background: `linear-gradient(90deg, ${C.purple}, ${C.blue})`, marginTop: 24 }} />
      <div
        style={{
          marginTop: 40,
          fontFamily: display,
          fontWeight: 300,
          fontSize: 42,
          color: C.muted,
          opacity: interpolate(frame, [50, 74], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Build healthier habits, together.
      </div>
    </AbsoluteFill>
  );
};
