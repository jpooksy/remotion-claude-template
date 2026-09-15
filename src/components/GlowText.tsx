import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";
import { FONT_FAMILY } from "../constants/fonts";
import { FadeIn } from "./FadeIn";

type GlowTextProps = {
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  animated?: boolean;
  pulsing?: boolean;
};

export const GlowText: React.FC<GlowTextProps> = ({
  text,
  fontSize = 36,
  color = COLORS.accent,
  delay = 0,
  animated = true,
  pulsing = false,
}) => {
  const frame = useCurrentFrame();

  const glowIntensity = pulsing
    ? interpolate(Math.sin((frame - delay) * 0.08), [-1, 1], [0.4, 1], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
      })
    : 1;

  return (
    <FadeIn delay={delay} animated={animated}>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize,
          fontWeight: 700,
          color,
          textShadow: `0 0 ${20 * glowIntensity}px ${color}80, 0 0 ${40 * glowIntensity}px ${color}40`,
        }}
      >
        {text}
      </span>
    </FadeIn>
  );
};
