import { BLOCK_NAMES } from "@links/blocks";
import { describe, expect, it } from "vitest";

import enUS from "./en-US";
import ruRU from "./ru-RU";

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
