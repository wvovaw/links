import { describe, expect, it, vi } from "vitest";

import { getActivity } from "./get-activity";

const { api } = vi.hoisted(() => ({ api: vi.fn() }));

vi.mock("../client", () => ({ useApiClient: () => api }));

describe("getActivity", () => {
  it("asks the endpoint with the limit and returns the items", async () => {
    api.mockResolvedValueOnce({ items: [{ id: "e1", kind: "click" }] });

    expect(await getActivity(5)).toEqual({ items: [{ id: "e1", kind: "click" }], failed: false });
    expect(api).toHaveBeenCalledWith("/analytics/activity", { query: { limit: 5 } });
  });

  /* "we could not ask" is a different fact from "nothing happened", exactly as getOverview already says. */
  it("reports a failure instead of throwing", async () => {
    api.mockRejectedValueOnce(new Error("down"));

    expect(await getActivity()).toEqual({ items: [], failed: true });
  });
});
