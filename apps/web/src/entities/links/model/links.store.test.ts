import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LinkStatus, LinksApi } from "~shared/api/backend";

import { useLinksStore } from "./links.store";

const confirmation = vi.hoisted(() => ({ confirmed: true }));

vi.mock("@links/ui", () => ({ useToast: () => ({ toast: vi.fn() }) }));

vi.mock("~shared/ui/confirmation-dialog", () => ({
  useConfirmation: () => ({
    createConfirmation: () => () => Promise.resolve({ data: confirmation.confirmed }),
  }),
}));

const params = {
  id: "link-1",
  title: "A page title long enough",
  blocks: [],
  seo: {},
  status: LinkStatus.PUBLISHED,
};

describe("links store updateLink result", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    confirmation.confirmed = true;
    vi.restoreAllMocks();
  });

  it("resolves true once the content and the metadata are stored", async () => {
    const updateContent = vi.spyOn(LinksApi, "updateContent").mockResolvedValue(undefined);
    const updateMetadata = vi.spyOn(LinksApi, "updateMetadata").mockResolvedValue(undefined);

    await expect(useLinksStore().updateLink(params)).resolves.toBe(true);

    expect(updateContent).toHaveBeenCalledTimes(1);
    expect(updateMetadata).toHaveBeenCalledTimes(1);
  });

  it("resolves false without touching the API when the confirmation is cancelled", async () => {
    confirmation.confirmed = false;
    const updateContent = vi.spyOn(LinksApi, "updateContent");

    await expect(useLinksStore().updateLink(params)).resolves.toBe(false);

    expect(updateContent).not.toHaveBeenCalled();
  });

  it("resolves false when the content update fails", async () => {
    vi.spyOn(LinksApi, "updateContent").mockRejectedValue(new Error("boom"));
    const updateMetadata = vi.spyOn(LinksApi, "updateMetadata");

    await expect(useLinksStore().updateLink(params)).resolves.toBe(false);

    expect(updateMetadata).not.toHaveBeenCalled();
  });
});

/* The list screen recounts its cards only when the page is really gone, so the result has to say which. */
describe("links store deleteLink result", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    confirmation.confirmed = true;
    vi.restoreAllMocks();
  });

  it("resolves true once the page is gone and the list is reread", async () => {
    const deleted = vi.spyOn(LinksApi, "deleteLink").mockResolvedValue(undefined);
    vi.spyOn(LinksApi, "listLinks").mockResolvedValue([]);

    await expect(useLinksStore().deleteLink("link-1")).resolves.toBe(true);

    expect(deleted).toHaveBeenCalledWith("link-1");
  });

  it("resolves false without touching the API when the deletion is cancelled", async () => {
    confirmation.confirmed = false;
    const deleted = vi.spyOn(LinksApi, "deleteLink");

    await expect(useLinksStore().deleteLink("link-1")).resolves.toBe(false);

    expect(deleted).not.toHaveBeenCalled();
  });
});
