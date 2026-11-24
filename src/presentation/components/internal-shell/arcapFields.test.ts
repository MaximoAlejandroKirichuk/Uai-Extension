import { describe, expect, it } from "vitest";
import {
  dedupeSegments,
  describeLinkStatus,
  hasText,
  resolveSiteLink,
  toStringList,
} from "./arcapFields";

describe("resolveSiteLink", () => {
  it("links a bare URL that was reached", () => {
    expect(resolveSiteLink("https://kaszek.com/", "ok")).toBe("https://kaszek.com/");
  });

  it("links a URL behind a redirect", () => {
    expect(resolveSiteLink("https://sf500.co", "redirect_301")).toBe("https://sf500.co");
  });

  it("refuses a site that answered with a captcha, a 403 or nothing", () => {
    expect(resolveSiteLink("https://cites-gss.com/", "captcha")).toBeNull();
    expect(resolveSiteLink("https://www.byxventures.com.ar/", "403")).toBeNull();
    expect(resolveSiteLink("https://www.embarca.tech/", "sin_contenido")).toBeNull();
    expect(resolveSiteLink("https://www.worcap.com/", "roto")).toBeNull();
  });

  it("links just the address when a pre-ARCAP record appended prose to it", () => {
    expect(resolveSiteLink("https://sf500.co / LinkedIn: SF500")).toBe("https://sf500.co");
  });

  it("links an unchecked bare URL", () => {
    expect(resolveSiteLink("https://kaszek.com/")).toBe("https://kaszek.com/");
  });

  it("returns null when there is no site", () => {
    expect(resolveSiteLink(undefined, "sin_sitio")).toBeNull();
    expect(resolveSiteLink("   ")).toBeNull();
  });
});

describe("describeLinkStatus", () => {
  it("explains a known status", () => {
    expect(describeLinkStatus("captcha")).toBe("el sitio pide captcha");
  });

  it("falls back when the status is absent or unknown", () => {
    expect(describeLinkStatus()).toBe("no se pudo verificar");
  });
});

describe("toStringList", () => {
  it("reads a plain array", () => {
    expect(toStringList(["Auth0", "Stamm"])).toEqual(["Auth0", "Stamm"]);
  });

  it("reads the index-keyed object Firebase can return instead", () => {
    expect(toStringList({ 0: "Auth0", 2: "Stamm" })).toEqual(["Auth0", "Stamm"]);
  });

  it("drops empty entries and missing values", () => {
    expect(toStringList(["Auth0", "", "   "])).toEqual(["Auth0"]);
    expect(toStringList(undefined)).toEqual([]);
    expect(toStringList(null)).toEqual([]);
  });
});

describe("hasText", () => {
  it("rejects whitespace and absent values", () => {
    expect(hasText("dato")).toBe(true);
    expect(hasText("   ")).toBe(false);
    expect(hasText(undefined)).toBe(false);
  });
});

describe("dedupeSegments", () => {
  it("drops a segment another segment already contains", () => {
    expect(dedupeSegments("Argentina \u00b7 Argentina; Estados Unidos")).toBe(
      "Argentina; Estados Unidos"
    );
  });

  it("collapses an exact repeat", () => {
    expect(dedupeSegments("Venture Capital \u00b7 Venture Capital")).toBe("Venture Capital");
  });

  it("keeps segments that say different things", () => {
    expect(dedupeSegments("Fintech \u00b7 AgTech")).toBe("Fintech \u00b7 AgTech");
  });

  it("leaves a single value and absent values alone", () => {
    expect(dedupeSegments("Argentina")).toBe("Argentina");
    expect(dedupeSegments(undefined)).toBeUndefined();
  });
});
