import { BLOCK_NAMES } from "@links/blocks";
import { describe, expect, it } from "vitest";

import enUS from "./en-US";
import ruRU from "./ru-RU";

/** Russian must carry English's keys, not a subset: a missing one falls back silently to English. */
describe("the share dialog", () => {
  it("has the same keys in both locales", async () => {
    const shareKeys = async (load: typeof enUS, name: string) =>
      Object.keys((await load(name)) as Record<string, string>)
        .filter((key) => key.startsWith("share."))
        .toSorted();

    expect(await shareKeys(ruRU, "ru-RU")).toEqual(await shareKeys(enUS, "en-US"));
  });
});

/**
 * `packages/blocks/README.md` step 6: every block names its label and description in every locale. The
 * palette falls back to the English metadata only for a key that is missing, so a missing translation
 * is invisible to the type checker and shows up as an English label in a translated palette.
 */
describe.each([
  ["en-US", enUS],
  ["ru-RU", ruRU],
])("the %s locale", (locale, loadMessages) => {
  it("carries a label and a description for every block", async () => {
    const messages = (await loadMessages(locale)) as Record<string, string>;

    for (const name of BLOCK_NAMES) {
      expect(messages[`blocks.${name}.label`]).toBeTruthy();
      expect(messages[`blocks.${name}.description`]).toBeTruthy();
    }
  });

  /* The share dialog is new, small and fully translated: a missing Russian key would print an English one. */
  it("carries every key the share dialog asks for", async () => {
    const messages = (await loadMessages(locale)) as Record<string, string>;
    const keys = Object.keys(messages).filter((key) => key.startsWith("share."));

    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) expect(messages[key]).toBeTruthy();
  });

  /* The chrome a block draws around its content: an iframe title, a link text, a figure name. */
  it("carries the chrome labels the public page draws", async () => {
    const messages = (await loadMessages(locale)) as Record<string, string>;

    for (const key of [
      "blocks.Map.frameTitle",
      "blocks.Map.openInMaps",
      "blocks.Music.frameTitle",
      "blocks.QrCode.code",
      "blocks.Video.frameTitle",
    ]) {
      expect(messages[key]).toBeTruthy();
    }
  });
});
