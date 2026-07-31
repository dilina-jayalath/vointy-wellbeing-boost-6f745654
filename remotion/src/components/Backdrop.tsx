import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 40;
  const drift2 = Math.cos(frame / 70) * 55;
  const glow = interpolate(Math.sin(frame / 55), [-1, 1], [0.18, 0.32]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.dark, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 900px at ${20 + drift / 8}% ${15 + drift2 / 20}%, rgba(155,135,245,${glow}), transparent 60%),
            radial-gradient(1000px 800px at ${85 + drift2 / 10}% ${80 - drift / 20}%, rgba(30,174,219,0.20), transparent 62%),
            linear-gradient(160deg, ${C.dark} 0%, ${C.darker} 100%)`,
        }}
      />
      {/* systematic grid */}
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: 0.1 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 80} y1={0} x2={i * 80} y2={1080} stroke={C.cream} strokeWidth={1} />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 80} x2={1920} y2={i * 80} stroke={C.cream} strokeWidth={1} />
        ))}
      </svg>
      {/* drifting dots */}
      {Array.from({ length: 18 }).map((_, i) => {
        const seed = i * 137.5;
        const x = (seed % 1800) + 60;
        const y = ((seed * 3.7) % 950) + 60;
        const dy = Math.sin((frame + i * 24) / 60) * 26;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + dy,
              width: 6,
              height: 6,
              borderRadius: 6,
              background: i % 3 === 0 ? C.blue : C.purple,
              opacity: 0.35,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
