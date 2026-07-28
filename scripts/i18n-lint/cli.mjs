#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkFiles } from "./check-hardcoded-strings.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../../src");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile() && fullPath.endsWith(".tsx") && !fullPath.endsWith(".test.tsx")) {
      files.push(fullPath);
    }
  }
  return files;
}

const targets = process.argv.slice(2);
const files = targets.length > 0 ? targets : walk(rootDir);
const violations = checkFiles(files);

if (violations.length > 0) {
  console.error(`Found ${violations.length} hardcoded string(s) outside the i18n message catalog:\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}:${v.column}  "${v.text}"`);
  }
  console.error(
    '\nRoute user-facing text through t() from src/i18n/messages.ts, or suppress a false positive with an ' +
      '"i18n-ignore" comment on the same line (e.g. `{/* i18n-ignore */}`) or the line above.'
  );
  process.exit(1);
}

console.log("No hardcoded JSX strings found outside the i18n message catalog.");
