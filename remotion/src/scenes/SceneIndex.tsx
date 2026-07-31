import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C } from "../theme";
import { display, mono } from "../fonts";
import { Kicker } from "../components/Kicker";

const values = [0.22, 0.34, 0.3, 0.46, 0.55, 0.5, 0.68, 0.74, 0.7, 0.85, 0.92, 1];
const labels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export const SceneIndex: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxH = 430;

  return (
    <AbsoluteFill style={{ padding: "100px 140px", justifyContent: "center" }}>
      <div style={{ marginBottom: 34 }}>
        <Kicker index="04" label="Activity index" fontFamily={mono} />
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 600,
          fontSize: 92,
          letterSpacing: -4,
          color: C.cream,
          opacity: interpolate(frame, [4, 22], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        One point per activity.
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: maxH + 60, marginTop: 56 }}>
        {values.map((v, i) => {
          const s = spring({ frame: frame - 20 - i * 3.5, fps, config: { damping: 18, stiffness: 120 } });
          const h = v * maxH * s;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 84,
                  height: h,
                  background: `linear-gradient(180deg, ${C.purple} 0%, ${C.blue} 100%)`,
                  opacity: 0.35 + v * 0.65,
                }}
              />
              <span style={{ fontFamily: mono, fontSize: 20, color: C.muted, letterSpacing: 2 }}>{labels[i]}</span>
            </div>
          );
        })}
        <div
          style={{
            marginLeft: 40,
            alignSelf: "flex-end",
            paddingBottom: 40,
            fontFamily: display,
            fontWeight: 300,
            fontSize: 34,
            color: C.cream,
            opacity: interpolate(frame, [64, 86], [0, 0.85], { extrapolateRight: "clamp" }),
            maxWidth: 300,
          }}
        >
          Monthly totals, summed across the membership year.
        </div>
      </div>
    </AbsoluteFill>
  );
};
