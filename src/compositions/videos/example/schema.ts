import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Props schema for the example composition. Remotion Studio renders editable
// controls for each field, so this doubles as the video's "config panel".
export const exampleSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  accentColor: zColor(),
  commands: z.array(
    z.object({
      text: z.string(),
      // Frame (relative to the terminal's own start) at which this line begins typing.
      startFrame: z.number().int().min(0),
    }),
  ),
});

export type ExampleProps = z.infer<typeof exampleSchema>;
