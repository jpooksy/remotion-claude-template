import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../../constants/colors";
import { INTER_TIGHT_FONT } from "../../../constants/fonts";
import { GlowText } from "../../../components/GlowText";
import { TerminalWindow } from "../../../components/TerminalWindow";
import { FadeIn } from "../../../components/FadeIn";
import type { ExampleProps } from "./schema";

// Timing constants. Root.tsx reads these to register the composition, so any
// video-length change lives here next to the component.
export const EXAMPLE_FPS = 30;
export const EXAMPLE_DURATION_IN_SECONDS = 6;
export const EXAMPLE_TOTAL_FRAMES = EXAMPLE_FPS * EXAMPLE_DURATION_IN_SECONDS;

// Minimal 1080x1920 (vertical) terminal-style demo. It exists to show the
// folder convention — Composition + schema + data — not to be a finished video.
export const ExampleComposition: React.FC<ExampleProps> = ({
  title,
  subtitle,
  accentColor,
  commands,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        gap: 48,
      }}
    >
      <FadeIn style={{ textAlign: "center" }}>
        <GlowText text={title} fontSize={96} color={accentColor} pulsing />
        <div
          style={{
            fontFamily: INTER_TIGHT_FONT,
            fontSize: 40,
            color: COLORS.textSecondary,
            marginTop: 24,
          }}
        >
          {subtitle}
        </div>
      </FadeIn>

      <TerminalWindow
        delay={20}
        width={840}
        charFrames={2}
        lines={commands.map((command) => ({
          text: command.text,
          startFrame: command.startFrame,
        }))}
        label="~/projects/my-app"
      />
    </AbsoluteFill>
  );
};
