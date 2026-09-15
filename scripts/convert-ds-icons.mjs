#!/usr/bin/env node
/**
 * Converts Vue single-file icon components from a design-system repo into
 * React/Remotion-compatible TSX.
 *
 * Reads:  <ICONS_DIR>/*.vue   (point this at your design-system's icon folder)
 * Writes: src/icons/*.tsx + index.ts barrel
 *
 * Each React icon accepts { size?: number; color?: string; style?: CSSProperties }
 *
 * Usage: ICONS_DIR=/path/to/design-system/icons node scripts/convert-ds-icons.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, basename } from "path";

// Point this at the design-system repo's icon directory. Override with the
// ICONS_DIR env var, or edit the default path below to match your setup.
const ICONS_DIR = process.env.ICONS_DIR ?? join(import.meta.dirname, "../icons-src");
const OUT_DIR = join(import.meta.dirname, "../src/icons");

mkdirSync(OUT_DIR, { recursive: true });

const vueFiles = readdirSync(ICONS_DIR).filter((f) => f.endsWith(".vue"));
const exports = [];
let converted = 0;
let skipped = 0;

for (const file of vueFiles) {
  const name = basename(file, ".vue");
  const src = readFileSync(join(ICONS_DIR, file), "utf-8");

  // Extract <template> content
  const tmplMatch = src.match(/<template>([\s\S]*?)<\/template>/);
  if (!tmplMatch) {
    console.warn(`⚠ Skipping ${name}: no <template> found`);
    skipped++;
    continue;
  }

  let svg = tmplMatch[1].trim();

  // Must be an SVG element
  if (!svg.startsWith("<svg")) {
    console.warn(`⚠ Skipping ${name}: template root is not <svg>`);
    skipped++;
    continue;
  }

  // --- Vue → React SVG attribute transforms ---

  // Remove HTML comments (invalid in JSX)
  svg = svg.replace(/<!--[\s\S]*?-->/g, "");

  // Remove Tailwind class attributes (we'll use width/height props instead)
  svg = svg.replace(/\s+:?class="[^"]*"/g, "");

  // Convert Vue dynamic :class to nothing (handled by props)
  svg = svg.replace(/\s+:class="`[^`]*`"/g, "");

  // Convert kebab-case SVG attributes to camelCase for React
  const attrMap = {
    "fill-opacity": "fillOpacity",
    "fill-rule": "fillRule",
    "clip-rule": "clipRule",
    "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin",
    "stroke-opacity": "strokeOpacity",
    "stroke-dasharray": "strokeDasharray",
    "stroke-dashoffset": "strokeDashoffset",
    "stroke-miterlimit": "strokeMiterlimit",
    "stop-color": "stopColor",
    "stop-opacity": "stopOpacity",
    "clip-path": "clipPath",
    "xmlns:xlink": "xmlnsXlink",
    "xlink:href": "xlinkHref",
  };

  for (const [kebab, camel] of Object.entries(attrMap)) {
    svg = svg.replaceAll(kebab, camel);
  }

  // Convert inline style strings to JSX style objects
  svg = svg.replace(/style="mask-type:alpha"/g, 'style={{maskType: "alpha"}}');
  svg = svg.replace(/style="mask-type:luminance"/g, 'style={{maskType: "luminance"}}');

  // Strip original width/height attributes from <svg> (replaced by props)
  svg = svg.replace(/(<svg[^>]*?)\s+width="[^"]*"/g, "$1");
  svg = svg.replace(/(<svg[^>]*?)\s+height="[^"]*"/g, "$1");

  // Inject width/height/color props into <svg> tag
  svg = svg.replace(
    "<svg",
    "<svg width={size} height={size} color={color} style={style}"
  );

  // Write TSX component
  const tsx = `import type { CSSProperties } from "react";

interface ${name}Props {
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export const ${name}: React.FC<${name}Props> = ({
  size = 24,
  color = "currentColor",
  style,
}) => (
  ${svg}
);
`;

  writeFileSync(join(OUT_DIR, `${name}.tsx`), tsx);
  exports.push(name);
  converted++;
}

// Write barrel export
const barrel = exports
  .sort()
  .map((n) => `export { ${n} } from "./${n}";`)
  .join("\n");

writeFileSync(join(OUT_DIR, "index.ts"), barrel + "\n");

console.log(`\n✅ Converted ${converted} icons, skipped ${skipped}`);
console.log(`📁 Output: ${OUT_DIR}`);
console.log(`📦 Barrel: ${exports.length} exports in index.ts`);
