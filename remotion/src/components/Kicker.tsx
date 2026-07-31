import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";

export const Kicker: React.FC<{ label: string; index: string; delay?: number; fontFamily: string }> = ({
  label,
  index,
  delay = 0,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = interpolate(frame - delay, [0, 30], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: o, display: "flex", alignItems: "center", gap: 22, fontFamily }}>
      <span style={{ color: C.blue, fontSize: 22, letterSpacing: 6 }}>{index}</span>
      <div style={{ width: w, height: 1, background: "rgba(244,241,234,0.35)" }} />
      <span style={{ color: C.muted, fontSize: 22, letterSpacing: 8, textTransform: "uppercase" }}>{label}</span>
    </div>
  );
};
