import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useLocaleStore", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("defaults to English when nothing is persisted", async () => {
    const { useLocaleStore } = await import("./locale");

    expect(useLocaleStore.getState().locale).toBe("en");
  });

  it("writes the selected locale to localStorage", async () => {
    const { useLocaleStore } = await import("./locale");

    useLocaleStore.getState().setLocale("fr");

    const stored = JSON.parse(localStorage.getItem("vortex-locale") ?? "{}");
    expect(stored.state.locale).toBe("fr");
  });

  it("restores the persisted locale across a simulated reload", async () => {
    const { useLocaleStore: beforeReload } = await import("./locale");
    beforeReload.getState().setLocale("ja");

    vi.resetModules();
    const { useLocaleStore: afterReload } = await import("./locale");

    expect(afterReload.getState().locale).toBe("ja");
  });
});
