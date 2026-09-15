import { COLORS } from "../../../constants/colors";
import type { ExampleProps } from "./schema";

// Default props used by the Studio and as the starting point for renders.
// Everything here is placeholder content — swap "Acme" for your own brand.
export const DEFAULT_PROPS: ExampleProps = {
  title: "Acme CLI",
  subtitle: "Ship your first build in one command",
  accentColor: COLORS.accent,
  commands: [
    { text: "$ npx acme init my-app", startFrame: 0 },
    { text: "✔ Scaffolding project", startFrame: 30 },
    { text: "✔ Installing dependencies", startFrame: 55 },
    { text: "→ Ready in 1.2s", startFrame: 80 },
  ],
};
