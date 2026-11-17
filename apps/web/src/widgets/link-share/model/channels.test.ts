import { describe, expect, it } from "vitest";

import { shareChannels } from "./channels";

/** The mediums the backend's source table already knows; anything else would print raw. */
const knownMediums = ["social", "email", "referral"];

describe("shareChannels", () => {
  it("offers every channel once", () => {
    const ids = shareChannels.map((channel) => channel.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  /* A preset the owner picks by name must land in a bucket the dashboard prints by name too. */
  it("only uses mediums the dashboard classifies", () => {
    for (const channel of shareChannels.filter((channel) => channel.id !== "custom")) {
      expect(knownMediums).toContain(channel.medium);
    }
  });

  it("leaves the custom channel blank, to be filled by hand", () => {
    const custom = shareChannels.find((channel) => channel.id === "custom");

    expect(custom?.source).toBe("");
    expect(custom?.medium).toBe("");
  });

  it("names a channel after its source, so the highlight can match what was typed", () => {
    for (const channel of shareChannels.filter((channel) => channel.id !== "custom")) {
      expect(channel.source).toBe(channel.id);
    }
  });
});
