import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY } from "../constants/fonts";

type ArrowProps = {
  fromColor: string;
  toColor: string;
  label?: string;
  delay?: number;
  animated?: boolean;
  width?: number;
  direction?: "horizontal" | "vertical";
};

export const Arrow: React.FC<ArrowProps> = ({
  fromColor,
  toColor,
  label,
  delay = 0,
  animated = true,
  width = 80,
  direction = "horizontal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = animated
    ? spring({ frame, fps, delay, config: { damping: 200 } })
    : 1;

  const isHorizontal = direction === "horizontal";
  const gradientId = `arrow-grad-${fromColor}-${toColor}-${delay}`.replace(
    /#/g,
    "",
  );

  const lineLength = width;
  const dashOffset = interpolate(progress, [0, 1], [lineLength, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isHorizontal ? "column" : "row",
        alignItems: "center",
        gap: 4,
      }}
    >
      {label && (
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 12,
            fontWeight: 600,
            color: "#666666",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {label}
        </span>
      )}
      <svg
        width={isHorizontal ? width : 20}
        height={isHorizontal ? 20 : width}
        viewBox={
          isHorizontal ? `0 0 ${width} 20` : `0 0 20 ${width}`
        }
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1={isHorizontal ? "0%" : "0%"}
            x2={isHorizontal ? "100%" : "0%"}
            y2={isHorizontal ? "0%" : "100%"}
          >
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        </defs>
        {isHorizontal ? (
          <>
            <line
              x1={0}
              y1={10}
              x2={width - 10}
              y2={10}
              stroke={`url(#${gradientId})`}
              strokeWidth={2}
              strokeDasharray={lineLength}
              strokeDashoffset={dashOffset}
            />
            <polygon
              points={`${width - 12},5 ${width},10 ${width - 12},15`}
              fill={toColor}
              opacity={progress}
            />
          </>
        ) : (
          <>
            <line
              x1={10}
              y1={0}
              x2={10}
              y2={width - 10}
              stroke={`url(#${gradientId})`}
              strokeWidth={2}
              strokeDasharray={lineLength}
              strokeDashoffset={dashOffset}
            />
            <polygon
              points={`5,${width - 12} 10,${width} 15,${width - 12}`}
              fill={toColor}
              opacity={progress}
            />
          </>
        )}
      </svg>
    </div>
  );
};
