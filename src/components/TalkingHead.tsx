import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";

/**
 * Speaker-overlay (talking-head PiP) for narrated product videos.
 *
 * Recipe:
 * - Record a face crop (16:9, e.g. 1280×720) narrating your teleprompter
 *   script, drop the mp4 into `public/`, and let the footage's own audio
 *   track carry the voice (volume 1.0). Everything else in the mix ducks
 *   under it — music at ~0.04, SFX at 0.05–0.25.
 * - Render this component LAST in your composition so it sits on top.
 * - Drive position/size with a "dodge path": keyframes that move the PiP
 *   away from whatever UI region is active at each beat, so it never
 *   covers the thing the narration is pointing at.
 * - The card pops in over the first 18 frames (0 → 1.15 → 1.0 overshoot)
 *   and fades out 20 frames before the footage ends.
 */
export type TalkingHeadKeyframe = {
  /** Composition frame at which the PiP should be at this position. */
  frame: number;
  left: number;
  top: number;
  /** Card width; height is derived as width × 9/16. */
  width: number;
};

export const TalkingHead: React.FC<{
  /** Filename inside `public/`, e.g. "talking-head.mp4". */
  src: string;
  /** Length of the footage in frames; the PiP fades out 20f before this. */
  videoDurationInFrames: number;
  /**
   * Dodge path. One keyframe = static position. Consecutive keyframes with
   * the same values hold; differing values glide between their frames.
   */
  keyframes: TalkingHeadKeyframe[];
  /**
   * Current frame. Pass explicitly when your composition offsets
   * `useCurrentFrame()` (e.g. a fly-in offset); defaults to the hook.
   */
  frame?: number;
  volume?: number;
}> = ({ src, videoDurationInFrames, keyframes, frame, volume = 1.0 }) => {
  const currentFrame = useCurrentFrame();
  const f = frame ?? currentFrame;

  const popOpacity = interpolate(f, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const popScale = interpolate(f, [0, 8, 18], [0, 1.15, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(
    f,
    [videoDurationInFrames - 20, videoDurationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const ease = Easing.bezier(0.4, 0, 0.2, 1);
  const opts = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  } as const;
  const frames = keyframes.map((k) => k.frame);
  const single = keyframes.length === 1;
  const left = single
    ? keyframes[0].left
    : interpolate(f, frames, keyframes.map((k) => k.left), opts);
  const top = single
    ? keyframes[0].top
    : interpolate(f, frames, keyframes.map((k) => k.top), opts);
  const width = single
    ? keyframes[0].width
    : interpolate(f, frames, keyframes.map((k) => k.width), opts);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height: width * (9 / 16),
        opacity: popOpacity * fadeOut,
        transform: `scale(${popScale})`,
        transformOrigin: "center center",
        borderRadius: 16,
        overflow: "hidden",
        border: "3px solid #fff",
        boxShadow: "0 10px 36px rgba(16,24,40,0.35)",
        zIndex: 60,
      }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        volume={volume}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};
