/**
 * Verifies that every asset path referenced in lib/assets.ts exists under
 * /public. Optional assets (declared below) may be absent — the app falls
 * back gracefully — so they only produce a warning, never a failure.
 *
 * Run: node scripts/check-assets.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib", "assets.ts"), "utf8");

// Collect every "/assets/..." string literal in the mapping.
const paths = [...new Set([...src.matchAll(/["'`](\/assets\/[^"'`]+)["'`]/g)].map((m) => m[1]))];

// Assets that are intentionally optional (graceful fallback in the UI).
const OPTIONAL = new Set(["/assets/ui/timer-ring.png", "/assets/ui/texture.png"]);

let missing = 0;
let warned = 0;
for (const p of paths) {
  const abs = join(root, "public", p);
  if (existsSync(abs)) continue;
  if (OPTIONAL.has(p)) {
    console.warn(`⚠ optional asset absent (fallback used): ${p}`);
    warned++;
  } else {
    console.error(`✗ missing required asset: ${p}`);
    missing++;
  }
}

if (missing > 0) {
  console.error(`\n${missing} required asset(s) missing.`);
  process.exit(1);
}
console.log(`✓ assets OK — ${paths.length} paths checked, ${warned} optional absent.`);
