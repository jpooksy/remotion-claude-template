import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type FadeInProps = {
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  animated?: boolean;
  translateY?: number;
};

export const FadeIn: React.FC<FadeInProps> = ({
  delay = 0,
  children,
  style,
  animated = true,
  translateY = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!animated) {
    return <div style={style}>{children}</div>;
  }

  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [translateY, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
