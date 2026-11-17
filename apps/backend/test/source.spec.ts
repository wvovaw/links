import { describe, expect, it } from "vitest";

import { toSourceColumns } from "../src/analytics/source";

describe("toSourceColumns", () => {
  it("lowercases and trims utm tags", () => {
    expect(toSourceColumns({ utmSource: "  Telegram ", utmMedium: "Social" })).toEqual({
      utmSource: "telegram",
      utmMedium: "social",
      utmCampaign: null,
      referrerHost: null,
      referrerInternal: false,
    });
  });

  /* The column is a label, not a document: a tagged link cannot be allowed to fill it. */
  it("caps a long tag at 100 characters", () => {
    expect(toSourceColumns({ utmCampaign: "c".repeat(200) }).utmCampaign).toHaveLength(100);
  });

  it("strips www and lowercases the host", () => {
    expect(toSourceColumns({ referrerHost: "WWW.Google.COM" }).referrerHost).toBe("google.com");
  });

  it("caps a host at 253 characters", () => {
    expect(toSourceColumns({ referrerHost: "h".repeat(400) }).referrerHost).toHaveLength(253);
  });

  /* `?utm_source=` with nothing after it is an absent tag, not an empty label the dashboard has to print. */
  it("keeps an empty tag as null", () => {
    expect(toSourceColumns({ utmSource: "   " }).utmSource).toBeNull();
  });

  it("defaults every absent field to null and internal to false", () => {
    expect(toSourceColumns({})).toEqual({
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      referrerHost: null,
      referrerInternal: false,
    });
  });
});
