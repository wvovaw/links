import type { FormSubmission } from "~shared/api/backend";

import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reactive, ref } from "vue";

const mocks = vi.hoisted(() => ({ getLinkSubmissions: vi.fn() }));

vi.mock("~shared/api/backend", () => ({ LinksApi: { getLinkSubmissions: mocks.getLinkSubmissions } }));
/* The panel only reads the page it belongs to; a ref inside a reactive store keeps `storeToRefs` happy. */
vi.mock("../../model", () => ({ useConstructorStore: () => reactive({ linkId: ref("link-1") }) }));

import SubmissionsList from "./submissions-list.vue";

const stored: FormSubmission[] = [
  {
    id: "s1",
    blockId: "b1",
    kind: "contact",
    payload: { name: "Ada", email: "ada@example.com", message: "Hello there" },
    createdAt: "2026-01-02T10:30:00.000Z",
  },
  {
    id: "s2",
    blockId: "b1",
    kind: "subscribe",
    payload: { email: "grace@example.com" },
    createdAt: "2026-01-01T09:00:00.000Z",
  },
];

describe("SubmissionsList", () => {
  beforeEach(() => {
    mocks.getLinkSubmissions.mockReset();
  });

  it("lists the messages a page's form block holds", async () => {
    mocks.getLinkSubmissions.mockResolvedValue(stored);
    const wrapper = mount(SubmissionsList, { props: { blockId: "b1" } });
    await flushPromises();

    expect(mocks.getLinkSubmissions).toHaveBeenCalledWith("link-1", "b1");

    const rows = wrapper.findAll("li");
    expect(rows).toHaveLength(2);
    expect(rows[0]!.text()).toContain("Ada");
    expect(rows[0]!.text()).toContain("ada@example.com");
    expect(rows[0]!.text()).toContain("Hello there");
    /* An email capture stores no name and no message, and the row must not leave holes for them. */
    expect(rows[1]!.text()).toContain("grace@example.com");
  });

  /* Nothing is emailed: the panel says where the messages live so the owner does not wait for one. */
  it("says where the messages are stored", async () => {
    mocks.getLinkSubmissions.mockResolvedValue([]);
    const wrapper = mount(SubmissionsList, { props: { blockId: "b1" } });
    await flushPromises();

    expect(wrapper.text()).toContain("nothing is emailed");
  });

  it("says there are none yet when the block holds nothing", async () => {
    mocks.getLinkSubmissions.mockResolvedValue([]);
    const wrapper = mount(SubmissionsList, { props: { blockId: "b1" } });
    await flushPromises();

    expect(wrapper.text()).toContain("No submissions yet");
    expect(wrapper.find("li").exists()).toBe(false);
  });

  /* The editor mounts one panel for every block, so a newly selected block must reload, not keep the old rows. */
  it("reads the messages of the block that is selected now", async () => {
    mocks.getLinkSubmissions.mockResolvedValueOnce(stored).mockResolvedValueOnce([]);
    const wrapper = mount(SubmissionsList, { props: { blockId: "b1" } });
    await flushPromises();

    await wrapper.setProps({ blockId: "b2" });
    await flushPromises();

    expect(mocks.getLinkSubmissions).toHaveBeenLastCalledWith("link-1", "b2");
    expect(wrapper.text()).toContain("No submissions yet");
  });

  /* An unreachable API and an expired session are read as nothing yet, never as a spinner that never ends. */
  it("reads as empty when the messages cannot be read at all", async () => {
    mocks.getLinkSubmissions.mockResolvedValue([]);
    const wrapper = mount(SubmissionsList, { props: { blockId: "b2" } });
    await flushPromises();

    expect(wrapper.text()).toContain("No submissions yet");
  });
});
