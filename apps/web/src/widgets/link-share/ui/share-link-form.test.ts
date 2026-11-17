import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import ShareLinkForm from "./share-link-form.vue";

const props = { base: "https://links.example", slug: "my-page" };
const plain = "https://links.example/my-page";

function form() {
  return mount(ShareLinkForm, { props });
}

function urlOf(wrapper: ReturnType<typeof form>) {
  return (wrapper.find("[data-url]").element as HTMLInputElement).value;
}

function stubClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
}

afterEach(() => {
  Reflect.deleteProperty(navigator, "clipboard");
});

describe("ShareLinkForm", () => {
  /* The dialog opens on the thing the product was missing: the page's own address. */
  it("starts on the plain page link", () => {
    expect(urlOf(form())).toBe(plain);
  });

  it("fills the tags when a channel is picked and the link follows", async () => {
    const wrapper = form();

    await wrapper.find("[data-channel='telegram']").trigger("click");

    expect((wrapper.find("[data-field='source']").element as HTMLInputElement).value).toBe("telegram");
    expect((wrapper.find("[data-field='medium']").element as HTMLInputElement).value).toBe("social");
    expect(urlOf(wrapper)).toBe(`${plain}?utm_source=telegram&utm_medium=social`);
    expect(wrapper.find("[data-channel='telegram']").attributes("data-active")).toBe("true");
  });

  /* Typing over a preset makes that preset a lie, so the mark goes away with the value. */
  it("drops the mark once the source is typed over", async () => {
    const wrapper = form();

    await wrapper.find("[data-channel='vk']").trigger("click");
    await wrapper.find("[data-field='source']").setValue("telegram");

    expect(wrapper.find("[data-channel='vk']").attributes("data-active")).toBe("false");
    expect(urlOf(wrapper)).toBe(`${plain}?utm_source=telegram&utm_medium=social`);
  });

  it("copies the link it shows", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard(writeText);
    const wrapper = form();

    await wrapper.find("[data-channel='newsletter']").trigger("click");
    await wrapper.find("[data-copy]").trigger("click");
    await new Promise((resolve) => setTimeout(resolve));

    expect(writeText).toHaveBeenCalledWith(`${plain}?utm_source=newsletter&utm_medium=email`);
    expect(wrapper.find("[data-copy]").attributes("data-copied")).toBe("true");
  });

  /* A blocked clipboard is a normal browser state, not an error: say what to do instead of claiming success. */
  it("asks to copy by hand when the clipboard refuses", async () => {
    stubClipboard(vi.fn().mockRejectedValue(new Error("blocked")));
    const wrapper = form();

    await wrapper.find("[data-copy]").trigger("click");
    await new Promise((resolve) => setTimeout(resolve));

    expect(wrapper.find("[data-testid='copy-hint']").exists()).toBe(true);
    expect(wrapper.find("[data-copy]").attributes("data-copied")).toBe("false");
  });

  it("returns to the plain link when the fields are cleared", async () => {
    const wrapper = form();

    await wrapper.find("[data-channel='partner']").trigger("click");
    await wrapper.find("[data-channel='custom']").trigger("click");

    expect(urlOf(wrapper)).toBe(plain);
  });

  it("draws a qr code for the link", () => {
    expect(form().find("[data-qr] svg").exists()).toBe(true);
  });

  it("draws no qr for a link a qr cannot hold", async () => {
    const wrapper = form();

    await wrapper.find("[data-field='source']").setValue("x".repeat(3000));

    expect(wrapper.find("[data-qr]").exists()).toBe(false);
  });
});
