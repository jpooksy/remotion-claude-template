import "./index.css";
import { Composition, Folder } from "remotion";
import {
  ExampleComposition,
  EXAMPLE_FPS,
  EXAMPLE_TOTAL_FRAMES,
} from "./compositions/videos/example/Composition";
import { exampleSchema } from "./compositions/videos/example/schema";
import { DEFAULT_PROPS as EXAMPLE_DEFAULT_PROPS } from "./compositions/videos/example/data";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Videos">
        <Composition
          id="Example"
          component={ExampleComposition}
          schema={exampleSchema}
          defaultProps={EXAMPLE_DEFAULT_PROPS}
          durationInFrames={EXAMPLE_TOTAL_FRAMES}
          fps={EXAMPLE_FPS}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
