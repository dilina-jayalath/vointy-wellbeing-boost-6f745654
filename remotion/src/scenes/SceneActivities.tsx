import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C } from "../theme";
import { display, mono } from "../fonts";
import { Kicker } from "../components/Kicker";

const COLS = 22;
const ROWS = 8;

export const SceneActivities: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = Math.round(
    interpolate(spring({ frame: frame - 10, fps, config: { damping: 200 } }), [0, 1], [0, 158])
  );

  return (
    <AbsoluteFill style={{ padding: "100px 140px", justifyContent: "center" }}>
      <div style={{ marginBottom: 36 }}>
        <Kicker index="03" label="Activity library" fontFamily={mono} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 34 }}>
        <span
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 200,
            lineHeight: 0.9,
            letterSpacing: -10,
            color: C.cream,
          }}
        >
          {count}
        </span>
        <span
          style={{
            fontFamily: display,
            fontWeight: 300,
            fontSize: 44,
            color: C.purple,
            paddingBottom: 26,
          }}
        >
          ready-made activities — plus your own
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 60, width: 1500 }}>
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const s = spring({ frame: frame - 14 - i * 0.5, fps, config: { damping: 20, stiffness: 220 } });
          const isAccent = i % 17 === 0;
          return (
            <div
              key={i}
              style={{
                width: 56,
                height: 20,
                borderRadius: 2,
                background: isAccent ? C.blue : "rgba(155,135,245,0.55)",
                transform: `scaleX(${s})`,
                transformOrigin: "left center",
                opacity: 0.25 + s * 0.6,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
