import type { BlockStats as Counters } from "~shared/api/backend";

import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reactive, ref } from "vue";

const mocks = vi.hoisted(() => ({ getLinkStats: vi.fn() }));

vi.mock("~shared/api/backend", () => ({ LinksApi: { getLinkStats: mocks.getLinkStats } }));
/* The panel only reads the page it belongs to; a ref inside a reactive store keeps `storeToRefs` happy. */
vi.mock("../../model", () => ({ useConstructorStore: () => reactive({ linkId: ref("link-1") }) }));

import BlockStats from "./block-stats.vue";

function counted(counters: Counters[]) {
  mocks.getLinkStats.mockResolvedValue(counters);
}

async function countersOf(blockId: string) {
  const wrapper = mount(BlockStats, { props: { blockId } });
  await flushPromises();

  return wrapper.findAll("dd").map((counter) => counter.text());
}

describe("BlockStats", () => {
  beforeEach(() => {
    mocks.getLinkStats.mockReset();
  });

  it("shows the clicks the page collected for the selected block", async () => {
    counted([{ blockId: "b1", clicks: 3, views: 7 }]);

    expect(await countersOf("b1")).toEqual(["3"]);
    expect(mocks.getLinkStats).toHaveBeenCalledWith("link-1");
  });

  /* A block nobody clicked has no row, and the panel must not hang or leave a blank where a number goes. */
  it("shows zeros for a block no event was recorded for", async () => {
    counted([]);

    expect(await countersOf("b2")).toEqual(["0"]);
  });

  it("shows zeros when the counters cannot be read at all", async () => {
    mocks.getLinkStats.mockResolvedValue([]);

    expect(await countersOf("b1")).toEqual(["0"]);
  });
});
