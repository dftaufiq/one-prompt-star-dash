// main.ts — STAR DASH entry for make.fun's "The agent builds a game from one prompt".
// Node 22, standard library only, no network. The entry itself is the X post:
// this program just hands the post's address (POST.json at the repo root) to the
// grader by copying it to /output/POST.json, and refuses a placeholder address
// so a bad POST.json can never be submitted by accident.
//
// Local run:  mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const POST_PATH = join(BOT_DIR, "POST.json");

const raw = readFileSync(POST_PATH, "utf8");
let post: unknown;
try {
  post = JSON.parse(raw);
} catch {
  console.error("POST.json is not valid JSON");
  process.exit(1);
}

const url =
  post !== null && typeof post === "object"
    ? (post as Record<string, unknown>).url
    : undefined;

if (typeof url !== "string" || !/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(url)) {
  console.error(
    "POST.json must name a real post: {\"url\": \"https://x.com/<handle>/status/<id>\"} — got: " +
      String(url),
  );
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(POST_PATH, join(OUTPUT_DIR, "POST.json"));
console.log("POST.json copied to " + join(OUTPUT_DIR, "POST.json") + " for " + url);
