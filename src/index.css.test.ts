import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf-8");

describe("Brand design tokens", () => {
  it("exposes the authority accent and supporting tokens", () => {
    expect(css).toContain("--color-brand: #7a1c2e");
    expect(css).toContain("--color-surface:");
    expect(css).toContain("--color-border:");
    expect(css).toContain("--color-focus:");
    expect(css).toContain("--color-danger:");
  });
});
