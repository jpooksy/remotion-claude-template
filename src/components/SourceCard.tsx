import React from "react";
import { COLORS } from "../constants/colors";
import { FONT_FAMILY } from "../constants/fonts";
import { FadeIn } from "./FadeIn";

type SourceCardProps = {
  name: string;
  description: string;
  dotColor: string;
  delay?: number;
  animated?: boolean;
};

export const SourceCard: React.FC<SourceCardProps> = ({
  name,
  description,
  dotColor,
  delay = 0,
  animated = true,
}) => {
  return (
    <FadeIn delay={delay} animated={animated}>
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 180,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: dotColor,
            flexShrink: 0,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.white,
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 14,
              color: COLORS.gray,
            }}
          >
            {description}
          </span>
        </div>
      </div>
    </FadeIn>
  );
};
