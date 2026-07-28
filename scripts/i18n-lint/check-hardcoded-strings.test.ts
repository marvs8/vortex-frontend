import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkFile } from "./check-hardcoded-strings.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) => path.join(__dirname, "__fixtures__", name);

describe("check-hardcoded-strings", () => {
  it("flags raw JSX text that bypasses the message catalog", () => {
    const violations = checkFile(fixture("violation.tsx"));

    expect(violations).toHaveLength(1);
    expect(violations[0].text).toBe("Connect Wallet");
  });

  it("allows text routed through t() or suppressed with the i18n-ignore escape hatch", () => {
    const violations = checkFile(fixture("clean.tsx"));

    expect(violations).toHaveLength(0);
  });
});
