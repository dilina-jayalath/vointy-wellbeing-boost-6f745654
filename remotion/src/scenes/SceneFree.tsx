import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C } from "../theme";
import { display, mono } from "../fonts";
import { Kicker } from "../components/Kicker";

const items = ["Unlimited employees", "Unlimited teams", "No per-user fees"];

export const SceneFree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ padding: "110px 140px", justifyContent: "center" }}>
      <div style={{ marginBottom: 40 }}>
        <Kicker index="02" label="Joining is free" fontFamily={mono} />
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 600,
          fontSize: 132,
          lineHeight: 1.02,
          letterSpacing: -5,
          color: C.cream,
          maxWidth: 1250,
          opacity: s,
          transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)`,
        }}
      >
        Companies join <span style={{ color: C.blue }}>free.</span>
      </div>
      <div style={{ display: "flex", gap: 28, marginTop: 70 }}>
        {items.map((it, i) => (
          <Sequence key={it} from={26 + i * 9} layout="none">
            <Item label={it} />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Item: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16, stiffness: 180 } });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
        border: "1px solid rgba(244,241,234,0.16)",
        borderTop: `2px solid ${C.purple}`,
        padding: "34px 40px",
        width: 380,
        background: "rgba(244,241,234,0.03)",
        fontFamily: display,
        fontWeight: 300,
        fontSize: 36,
        color: C.cream,
      }}
    >
      {label}
    </div>
  );
};
