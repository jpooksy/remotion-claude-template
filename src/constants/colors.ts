// Design-system tokens for the video project.
// Values are dark-mode resolved hex values for Remotion (no CSS vars).
// Swap these for your own brand palette; the token names are what the
// compositions and workflow docs reference, so keep the structure intact.

// ─── Primitive palette ────────────────────────────────────────────────

export const DS_BASE = {
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const DS_NEUTRAL = {
  5: "#0A0A0A",
  10: "#0F0F0F",
  15: "#141414",
  20: "#1F1F1F",
  25: "#292929",
  30: "#333333",
  35: "#3D3D3D",
  40: "#525252",
  45: "#666666",
  50: "#7A7A7A",
  55: "#8F8F8F",
  60: "#A3A3A3",
  65: "#B8B8B8",
  70: "#C2C2C2",
  75: "#CCCCCC",
  80: "#D6D6D6",
  85: "#E0E0E0",
  90: "#EBEBEB",
  95: "#F5F5F5",
  100: "#FAFAFA",
} as const;

export const DS_RED = {
  10: "#FFECEB", 15: "#FFC7C2", 20: "#FFA199", 25: "#FF7C70",
  30: "#FF5747", 35: "#FF1F0A", 40: "#CC1100", 45: "#A30E00",
  50: "#7A0A00", 55: "#520700", 60: "#290300",
} as const;

export const DS_ORANGE = {
  10: "#FFF3EB", 15: "#FFDBC2", 20: "#FFC399", 25: "#FFAC70",
  30: "#FF9447", 35: "#FF700A", 40: "#CC5500", 45: "#A34400",
  50: "#7A3300", 55: "#522200", 60: "#291100",
} as const;

export const DS_YELLOW = {
  10: "#FFFCEB", 15: "#FFF5C2", 20: "#FFEE99", 25: "#FFE770",
  30: "#FFE047", 35: "#FFD60A", 40: "#CCAA00", 45: "#A38800",
  50: "#7A6600", 55: "#524400", 60: "#292200",
} as const;

export const DS_LIME = {
  10: "#FCFFEB", 15: "#F5FFC2", 20: "#EEFF99", 25: "#E7FF70",
  30: "#E0FF47", 35: "#D6FF0A", 40: "#AACC00", 45: "#88A300",
  50: "#667A00", 55: "#445200", 60: "#222900",
} as const;

export const DS_GREEN = {
  10: "#EBFFF0", 15: "#C2FFD1", 20: "#99FFB3", 25: "#70FF94",
  30: "#47FF75", 35: "#0AFF47", 40: "#00CC33", 45: "#00A329",
  50: "#007A1F", 55: "#005214", 60: "#00290A",
} as const;

export const DS_CYAN = {
  10: "#EBFFFF", 15: "#C2FFFF", 20: "#99FFFF", 25: "#70FFFF",
  30: "#47FFFF", 35: "#0AFFFF", 40: "#00CCCC", 45: "#00A3A3",
  50: "#007A7A", 55: "#005252", 60: "#002929",
} as const;

export const DS_BLUE = {
  10: "#EBF7FF", 15: "#C2E6FF", 20: "#99D5FF", 25: "#70C4FF",
  30: "#47B3FF", 35: "#0A99FF", 40: "#0077CC", 45: "#005FA3",
  50: "#00477A", 55: "#003052", 60: "#001829",
} as const;

export const DS_PURPLE = {
  10: "#F8EBFF", 15: "#EBC2FF", 20: "#DD99FF", 25: "#CF70FF",
  30: "#C247FF", 35: "#AD0AFF", 40: "#8800CC", 45: "#6D00A3",
  50: "#52007A", 55: "#360052", 60: "#1B0029",
} as const;

export const DS_PINK = {
  10: "#FFEBF8", 15: "#FFC2EB", 20: "#FF99DD", 25: "#FF70CF",
  30: "#FF47C2", 35: "#FF0AAD", 40: "#CC0088", 45: "#A3006D",
  50: "#7A0052", 55: "#520036", 60: "#29001B",
} as const;

// ─── Semantic tokens (dark mode) ──────────────────────────────────────

export const DS_TEXT = {
  primary: DS_NEUTRAL[95],   // #F5F5F5
  secondary: DS_NEUTRAL[65], // #B8B8B8
  tertiary: DS_NEUTRAL[50],  // #7A7A7A
  muted: DS_NEUTRAL[35],     // #3D3D3D
  inverted: DS_NEUTRAL[85],  // #E0E0E0
  onAccent: DS_NEUTRAL[100], // #FAFAFA
} as const;

export const DS_SURFACE = {
  background: DS_NEUTRAL[10], // #0F0F0F
  card: DS_NEUTRAL[15],       // #141414
  panel: DS_NEUTRAL[15],      // #141414
  page: DS_NEUTRAL[20],       // #1F1F1F
  nested: DS_NEUTRAL[5],      // #0A0A0A
  inverted: DS_NEUTRAL[20],   // #1F1F1F
  accent: DS_BLUE[35],        // #0A99FF
  translucent: "rgba(26,26,26,0.9)",
  editorBackground: DS_NEUTRAL[5], // #0A0A0A
} as const;

export const DS_BORDER = {
  primary: DS_NEUTRAL[35],   // #3D3D3D
  secondary: DS_NEUTRAL[25], // #292929
  tertiary: DS_NEUTRAL[20],  // #1F1F1F
  inverted: DS_NEUTRAL[25],  // #292929
  accent: DS_BLUE[35],       // #0A99FF
} as const;

export const DS_ICON = {
  primary: DS_NEUTRAL[90],   // #EBEBEB
  secondary: DS_NEUTRAL[70], // #C2C2C2
  tertiary: DS_NEUTRAL[45],  // #666666
  muted: DS_NEUTRAL[30],     // #333333
} as const;

// ─── Additional semantic tokens ──────────────────────────────────────

// fill-primary
export const DS_FILL_PRIMARY = {
  enabled: DS_NEUTRAL[45],   // #666666
  onEnabled: DS_NEUTRAL[95], // #F5F5F5
  hover: DS_NEUTRAL[50],     // #7A7A7A
  disabled: DS_NEUTRAL[25],  // #292929
  onDisabled: DS_NEUTRAL[40],// #525252
} as const;

// fill-secondary
export const DS_FILL_SECONDARY = {
  enabled: DS_NEUTRAL[30],   // #333333
  hover: DS_NEUTRAL[35],     // #3D3D3D
  onEnabled: DS_NEUTRAL[95], // #F5F5F5
  disabled: DS_NEUTRAL[25],
  onDisabled: DS_NEUTRAL[40],
} as const;

// fill-destructive
export const DS_FILL_DESTRUCTIVE = {
  enabled: DS_RED[35],       // #FF1F0A
  hover: DS_RED[40],         // #CC1100
  onEnabled: DS_BASE.white,
} as const;

// icon-tones (all at 0.8/0.5/0.2 alpha based on the DS_*[30] hue)
export const DS_ICON_TONES = {
  blue: { primary: "rgba(71,179,255,0.8)", secondary: "rgba(71,179,255,0.5)", tertiary: "rgba(71,179,255,0.2)" },
  orange: { primary: "rgba(255,148,71,0.8)", secondary: "rgba(255,148,71,0.5)", tertiary: "rgba(255,148,71,0.2)" },
  purple: { primary: "rgba(194,71,255,0.8)", secondary: "rgba(194,71,255,0.5)", tertiary: "rgba(194,71,255,0.2)" },
  green: { primary: "rgba(71,255,117,0.8)", secondary: "rgba(71,255,117,0.5)", tertiary: "rgba(71,255,117,0.2)" },
  red: { primary: "rgba(204,17,0,0.8)", secondary: "rgba(204,17,0,0.5)", tertiary: "rgba(204,17,0,0.2)" },
  yellow: { primary: "rgba(255,224,71,0.8)", secondary: "rgba(255,224,71,0.5)", tertiary: "rgba(255,224,71,0.2)" },
  pink: { primary: "rgba(255,71,194,0.8)", secondary: "rgba(255,71,194,0.5)", tertiary: "rgba(255,71,194,0.2)" },
} as const;

// state
export const DS_STATE = {
  hover: "rgba(255,255,255,0.04)",
  selectedEnabled: "rgba(255,255,255,0.08)",
  selectedHover: "rgba(255,255,255,0.25)",
} as const;

// focus box-shadow
export const DS_FOCUS = {
  inner: "rgba(0,143,245,1)",
  outer: "rgba(0,143,245,0.16)",
} as const;

// surface-sentiment
export const DS_SURFACE_SENTIMENT = {
  positive: "rgba(0,163,41,0.12)",
  negative: "rgba(255,31,10,0.12)",
  caution: "rgba(255,148,71,0.12)",
  informative: "rgba(10,153,255,0.12)",
} as const;

// text-sentiment
export const DS_TEXT_SENTIMENT = {
  positive: DS_GREEN[45],    // #00A329
  negative: DS_RED[40],      // #CC1100
  caution: DS_ORANGE[40],    // #CC5500
  informative: DS_BLUE[35],  // #0A99FF
} as const;

// avatar fill
export const DS_AVATAR = {
  fill: DS_NEUTRAL[20],      // #1F1F1F
  border: DS_NEUTRAL[25],    // #292929
  content: DS_NEUTRAL[95],   // #F5F5F5
} as const;

// component-toggle — switch unchecked track/thumb
export const DS_COMPONENT_TOGGLE = {
  enabled: DS_NEUTRAL[30],    // #333333 — track
  onEnabled: DS_NEUTRAL[70],  // #C2C2C2 — thumb
  hover: DS_NEUTRAL[35],      // #3D3D3D
  disabled: DS_NEUTRAL[25],   // #292929
  onDisabled: DS_NEUTRAL[40], // #525252
  pressed: DS_NEUTRAL[40],    // #525252
} as const;

// component-selected — switch checked track/thumb
export const DS_COMPONENT_SELECTED = {
  enabled: DS_BLUE[35],       // #0A99FF — track
  onEnabled: DS_BASE.white,   // #FFFFFF — thumb
  hover: DS_BLUE[40],         // #0077CC
  pressed: DS_BLUE[45],       // #005FA3
  disabled: DS_NEUTRAL[35],   // #3D3D3D
  onDisabled: DS_NEUTRAL[50], // #7A7A7A
} as const;

// outline-secondary — checkbox unchecked border
export const DS_OUTLINE = {
  secondaryEnabled: DS_NEUTRAL[35], // #3D3D3D
} as const;

// Tree/list hover overlay — sky-400/10 (Tailwind sky-400 = #38BDF8).
export const CATALOG_HOVER_OVERLAY = "rgba(56, 189, 248, 0.10)";

// Sky-300 (#7DD3FC) — selected-option icon highlight.
export const CATALOG_SKY_HIGHLIGHT = "#7DD3FC";

// ─── Backward-compatible COLORS (used by existing compositions) ───────

export const COLORS = {
  // Text
  textPrimary: DS_TEXT.primary,
  textSecondary: DS_TEXT.secondary,
  textTertiary: DS_TEXT.tertiary,

  // Accent
  accent: DS_BLUE[35],
  accentDark: DS_BLUE[40],

  // Surfaces (darkest → lightest)
  bgColor: DS_SURFACE.background,
  surface: DS_SURFACE.card,
  border: DS_BORDER.tertiary,
  muted: DS_NEUTRAL[35],

  // Interactive
  hover: "rgba(255,255,255,0.06)",

  // Semantic
  red: DS_RED[35],
  green: DS_GREEN[40],
  purple: DS_PURPLE[35],
  amber: DS_YELLOW[35],
  pink: DS_PINK[35],
  orange: DS_ORANGE[35],
  cyan: DS_CYAN[35],
  lime: DS_LIME[35],

  // Third-party brand colors
  stripe: "#635bff",
  salesforce: "#00a1e0",
  postgres: "#336791",
  sheets: "#0f9d58",
  snowflake: "#29b5e8",
  fivetran: "#0073ff",
  dbt: "#ff694a",
  looker: "#4285f4",
  shopify: "#95BF47",
  meta: "#1877f2",
  google: "#ea4335",

  // Legacy aliases (keep compositions working)
  bg: DS_SURFACE.background,
  card: DS_SURFACE.card,
  white: DS_TEXT.primary,
  gray: DS_TEXT.tertiary,
} as const;
