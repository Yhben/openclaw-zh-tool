import fs from "node:fs";
import path from "node:path";
import { resolveContext } from "./lib.js";

function loadJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function main() {
  const ctx = resolveContext();
  const reviewPath = path.join(ctx.repoRoot, "supplements", "review-candidates.json");
  const customPath = path.join(ctx.repoRoot, "supplements", "custom-exact.json");
  const review = loadJson(reviewPath, { review: [] });
  const custom = loadJson(customPath, { exact: {} });

  const requestedTexts = process.argv.slice(2);
  const selected = requestedTexts.length === 0
    ? review.review
    : review.review.filter((item) => requestedTexts.includes(item.text));

  if (selected.length === 0) {
    console.log("No review candidates selected.");
    return;
  }

  let added = 0;
  for (const item of selected) {
    if (!item.text || !item.translation) continue;
    if (custom.exact[item.text] !== item.translation) {
      custom.exact[item.text] = item.translation;
      added += 1;
    }
  }

  fs.writeFileSync(customPath, `${JSON.stringify(custom, null, 2)}\n`);

  const remaining = review.review.filter((item) => !selected.some((chosen) => chosen.text === item.text));
  fs.writeFileSync(reviewPath, `${JSON.stringify({ ...review, review: remaining }, null, 2)}\n`);

  console.log(`Promoted review candidates: ${selected.length}`);
  console.log(`Custom exact entries updated: ${added}`);
  console.log(`Custom supplement file: ${customPath}`);
  console.log(`Remaining review candidates: ${remaining.length}`);
  console.log("Run `node bin/openclaw-zh.js install` to inject updated custom supplements.");
}

main();
