import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";

const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const { fontFamily: interTightFamily } = loadInterTight("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const { fontFamily: jetBrainsMonoFamily } = loadJetBrainsMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

const { fontFamily: instrumentSerifFamily } = loadInstrumentSerif("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// Default sans + mono used across most compositions.
export const FONT_FAMILY = interFamily;
export const MONO_FONT = "'SF Mono', 'Fira Code', 'Courier New', monospace";

// Alternate design-system fonts available for headline/display use.
export const INTER_TIGHT_FONT = interTightFamily;
export const JETBRAINS_MONO_FONT = jetBrainsMonoFamily;
export const INSTRUMENT_SERIF_FONT = instrumentSerifFamily;
