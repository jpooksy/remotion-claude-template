import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";
import { MONO_FONT } from "../constants/fonts";
import { FadeIn } from "./FadeIn";

type TerminalLine = {
  text: string;
  color?: string;
  startFrame?: number;
};

type TerminalWindowProps = {
  lines: TerminalLine[];
  label?: string;
  delay?: number;
  animated?: boolean;
  charFrames?: number;
  width?: number;
};

const Cursor: React.FC<{ frame: number }> = ({ frame }) => {
  const blinkFrames = 16;
  const opacity = interpolate(
    frame % blinkFrames,
    [0, blinkFrames / 2, blinkFrames],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <span style={{ opacity, color: COLORS.accent, marginLeft: 2 }}>
      {"\u258C"}
    </span>
  );
};

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  lines,
  label,
  delay = 0,
  animated = true,
  charFrames = 2,
  width,
}) => {
  const frame = useCurrentFrame();

  const getTypedText = (text: string, startFrame: number) => {
    if (!animated) return text;
    const elapsed = frame - delay - startFrame;
    if (elapsed < 0) return "";
    const chars = Math.floor(elapsed / charFrames);
    return text.slice(0, Math.min(chars, text.length));
  };

  const isTypingComplete = (text: string, startFrame: number) => {
    if (!animated) return true;
    const elapsed = frame - delay - startFrame;
    return elapsed >= text.length * charFrames;
  };

  // Find which line is currently being typed
  let currentlyTypingIndex = -1;
  if (animated) {
    for (let i = 0; i < lines.length; i++) {
      const start = lines[i].startFrame ?? 0;
      if (!isTypingComplete(lines[i].text, start)) {
        currentlyTypingIndex = i;
        break;
      }
    }
  }

  return (
    <FadeIn delay={delay} animated={animated}>
      <div
        style={{
          background: COLORS.card,
          border: `2px solid rgba(10, 153, 255, 0.4)`,
          borderRadius: 12,
          padding: "20px 24px",
          width: width ?? "auto",
        }}
      >
        {/* Window controls */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ff5f57",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#febc2e",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#28c840",
            }}
          />
        </div>

        {/* Terminal lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lines.map((line, i) => {
            const startFrame = line.startFrame ?? 0;
            const typed = getTypedText(line.text, startFrame);
            const showLine = !animated || frame >= delay + startFrame;
            if (!showLine) return null;
            return (
              <div
                key={i}
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 16,
                  color: line.color ?? COLORS.accent,
                  whiteSpace: "pre",
                }}
              >
                {typed}
                {animated && currentlyTypingIndex === i && (
                  <Cursor frame={frame} />
                )}
              </div>
            );
          })}
        </div>

        {/* Label */}
        {label && (
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 14,
              color: COLORS.gray,
              marginTop: 12,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </FadeIn>
  );
};
