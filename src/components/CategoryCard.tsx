import React from "react";
import { COLORS } from "../constants/colors";
import { FONT_FAMILY, MONO_FONT } from "../constants/fonts";
import { FadeIn } from "./FadeIn";

type CategoryCardProps = {
  icon: string;
  name: string;
  color: string;
  tools: string[];
  delay?: number;
  animated?: boolean;
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  name,
  color,
  tools,
  delay = 0,
  animated = true,
}) => {
  return (
    <FadeIn delay={delay} animated={animated}>
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: `${color}26`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 22,
              color,
            }}
          >
            {icon}
          </div>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 24,
              fontWeight: 700,
              color: COLORS.white,
            }}
          >
            {name}
          </span>
        </div>

        {/* Tool list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {tools.map((tool) => (
            <div
              key={tool}
              style={{
                fontFamily: MONO_FONT,
                fontSize: 17,
                color: "#aaaaaa",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                padding: "6px 10px",
                borderRadius: 6,
              }}
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
};
