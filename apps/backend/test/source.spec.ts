import { describe, expect, it } from "vitest";

import { toSourceColumns } from "../src/analytics/source";
import { classifySource } from "../src/analytics/stats";

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

/** The stored facts a label is derived from: every field present, none of them set. */
const sourced = {
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  referrerHost: null,
  referrerInternal: false,
};

describe("classifySource", () => {
  /* The visitor followed a tagged link, so what the tag says outranks whatever the browser still sends. */
  it("prefers utm over the referrer", () => {
    expect(classifySource({ ...sourced, utmSource: "tg", utmMedium: "social", referrerHost: "google.com" })).toEqual({
      source: "tg",
      medium: "social",
    });
  });

  it("falls back to the referring host", () => {
    expect(classifySource({ ...sourced, referrerHost: "google.com" })).toEqual({
      source: "google.com",
      medium: "search",
    });
  });

  /* A visit inside the site is a visit; it is only not an acquisition, and calling it `direct` would lie. */
  it("calls an internal navigation internal, not direct", () => {
    expect(classifySource({ ...sourced, referrerInternal: true })).toEqual({
      source: "internal",
      medium: "internal",
    });
  });

  it("calls a visit with nothing direct", () => {
    expect(classifySource(sourced)).toEqual({ source: "direct", medium: "direct" });
  });

  it("classifies an unlisted host as referral", () => {
    expect(classifySource({ ...sourced, referrerHost: "news.example.org" }).medium).toBe("referral");
  });

  it("classifies t.me as social and yandex.ru as search", () => {
    expect(classifySource({ ...sourced, referrerHost: "t.me" }).medium).toBe("social");
    expect(classifySource({ ...sourced, referrerHost: "yandex.ru" }).medium).toBe("search");
  });

  /* A tagged link without a medium says where it came from and not what it was: `referral` is the honest bucket. */
  it("falls back to referral for a tag with no medium", () => {
    expect(classifySource({ ...sourced, utmSource: "newsletter" })).toEqual({
      source: "newsletter",
      medium: "referral",
    });
  });
});
