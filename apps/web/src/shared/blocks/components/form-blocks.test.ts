import type { BlockName, IBlock, IBlockPropertySelectMultiple } from "@links/blocks";

import { createBlock } from "@links/blocks";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ submitForm: vi.fn() }));

/* The real module, with the one call that leaves the page replaced: everything else is what it is. */
vi.mock("~shared/api/backend", async (importOriginal) => {
  const actual = await importOriginal<typeof import("~shared/api/backend")>();

  return { ...actual, PublicApi: { ...actual.PublicApi, submitForm: mocks.submitForm } };
});

import ContactFormBlock from "./contact-form-block.vue";
import EmailCaptureBlock from "./email-capture-block.vue";

/** A block whose stored values are exactly the ones a page carries, as the renderer passes them. */
function blockOf(name: BlockName, values: Record<string, unknown> = {}): IBlock {
  const block = createBlock(name, "b1");
  for (const [key, value] of Object.entries(values)) {
    const property = block.properties[key];
    if (property) Object.assign(property, { value });
  }
  return block;
}

/** The page a form is served from: its route names the slug `link`. */
const mountContact = (blockId: string | undefined = "b1", values: Record<string, unknown> = {}) =>
  mountSuspended(ContactFormBlock, {
    props: { properties: blockOf("ContactForm", values).properties, blockId },
    route: "/my-page",
  });

const mountCapture = (blockId: string | undefined = "b1", values: Record<string, unknown> = {}) =>
  mountSuspended(EmailCaptureBlock, {
    props: { properties: blockOf("EmailCapture", values).properties, blockId },
    route: "/my-page",
  });

describe("ContactFormBlock", () => {
  beforeEach(() => {
    mocks.submitForm.mockReset();
    mocks.submitForm.mockResolvedValue(undefined);
  });

  it("asks for the address always and for the optional fields the page selected", async () => {
    const full = await mountContact();
    expect(full.get('input[type="email"]').attributes("required")).toBeDefined();
    expect(full.find('input[id$="-name"]').exists()).toBe(true);
    expect(full.find("textarea").exists()).toBe(true);

    const messageOnly = await mountContact("b1", { fields: ["message"] });
    expect(messageOnly.find('input[id$="-name"]').exists()).toBe(false);
    expect(messageOnly.find('input[type="email"]').exists()).toBe(true);
    expect(messageOnly.find("textarea").exists()).toBe(true);
  });

  /* A page a visitor reads is the only page a message can be stored on. */
  it("keeps the submit button disabled where there is no page to write to", async () => {
    const wrapper = await mountSuspended(ContactFormBlock, {
      props: { properties: blockOf("ContactForm").properties, blockId: undefined },
      route: "/my-page",
    });

    expect(wrapper.get("button").attributes("disabled")).toBeDefined();
  });

  /* Inside a form a button defaults to submit, but the attribute says so out loud. */
  it("submits through a button the browser knows is a submit", async () => {
    const wrapper = await mountContact();

    expect(wrapper.get("button").attributes("type")).toBe("submit");
  });

  it("submits the filled fields under the page's slug and the block's id", async () => {
    const wrapper = await mountContact();
    await wrapper.get('input[id$="-name"]').setValue("Ada");
    await wrapper.get('input[type="email"]').setValue("ada@example.com");
    await wrapper.get("textarea").setValue("Hello there");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(mocks.submitForm).toHaveBeenCalledWith({
      slug: "my-page",
      blockId: "b1",
      kind: "contact",
      name: "Ada",
      email: "ada@example.com",
      message: "Hello there",
      company: "",
    });
  });

  /* Nothing is emailed: the block says the message is stored, and the form is gone once it is. */
  it("swaps the form for the success message once the message is stored", async () => {
    const wrapper = await mountContact();
    await wrapper.get('input[type="email"]').setValue("ada@example.com");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.find("form").exists()).toBe(false);
    expect(wrapper.get('[role="status"]').text()).toBe("Thank you, we will get back to you");
  });

  it("keeps the form and says why when the submission fails", async () => {
    mocks.submitForm.mockRejectedValue({ status: 400 });
    const wrapper = await mountContact();
    await wrapper.get('input[type="email"]').setValue("ada@example.com");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.get('[role="alert"]').text()).toBe("Your message could not be saved. Please try again.");
  });

  it("says the page is busy when the window is exhausted", async () => {
    mocks.submitForm.mockRejectedValue({ status: 429 });
    const wrapper = await mountContact();
    await wrapper.get('input[type="email"]').setValue("ada@example.com");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toBe("This page has taken too many messages. Try again in a minute.");
  });

  it("disables the button while the submission is in flight", async () => {
    let settle = () => {};
    mocks.submitForm.mockReturnValue(
      new Promise<void>((resolve) => {
        settle = resolve;
      }),
    );
    const wrapper = await mountContact();
    await wrapper.get('input[type="email"]').setValue("ada@example.com");
    await wrapper.get("form").trigger("submit");

    expect(wrapper.get("button").attributes("disabled")).toBeDefined();

    settle();
    await flushPromises();
    expect(wrapper.find("form").exists()).toBe(false);
  });

  /*
    The honeypot is the field only a robot fills: it must exist to be filled, stay out of a person's way,
    and reach the API as `company` — that is what the server reads to drop the submission.
  */
  it("carries the honeypot out of the tab order and sends whatever filled it", async () => {
    const wrapper = await mountContact();
    const trap = wrapper.get('input[name="company"]');

    expect(trap.attributes("tabindex")).toBe("-1");
    expect(trap.attributes("aria-hidden")).toBe("true");

    await trap.setValue("Spam Ltd");
    await wrapper.get('input[type="email"]').setValue("robot@example.com");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(mocks.submitForm).toHaveBeenCalledWith(expect.objectContaining({ company: "Spam Ltd" }));
  });

  it("uses the labels and defaults the block stores", async () => {
    const wrapper = await mountContact("b1", {
      "title": "Say hello",
      "button-label": "Write to us",
      "success-message": "We have it",
    });

    expect(wrapper.text()).toContain("Say hello");
    expect(wrapper.get("button").text()).toBe("Write to us");

    await wrapper.get('input[type="email"]').setValue("ada@example.com");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get('[role="status"]').text()).toBe("We have it");
  });

  /* A field added to the schema's option list reaches the form without anyone editing this component. */
  it("draws the optional fields in the order the schema lists them", async () => {
    const wrapper = await mountContact("b1", { fields: ["message", "name"] });
    const ids = wrapper.findAll("input[id], textarea[id]").map((field) => field.attributes("id"));

    expect(ids).toEqual(["b1-name", "b1-email", "b1-message"]);
  });
});

describe("EmailCaptureBlock", () => {
  beforeEach(() => {
    mocks.submitForm.mockReset();
    mocks.submitForm.mockResolvedValue(undefined);
  });

  it("stores the address alone under the subscribe kind", async () => {
    const wrapper = await mountCapture();
    await wrapper.get('input[type="email"]').setValue("ada@example.com");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(mocks.submitForm).toHaveBeenCalledWith({
      slug: "my-page",
      blockId: "b1",
      kind: "subscribe",
      email: "ada@example.com",
      company: "",
    });
    expect(wrapper.get('[role="status"]').text()).toBe("Thank you, your address is saved");
  });

  it("submits through a button the browser knows is a submit", async () => {
    const wrapper = await mountCapture();

    expect(wrapper.get("button").attributes("type")).toBe("submit");
  });

  it("shows the stored placeholder and button label", async () => {
    const wrapper = await mountCapture("b1", { "placeholder": "you@example.com", "button-label": "Join" });

    expect(wrapper.get('input[type="email"]').attributes("placeholder")).toBe("you@example.com");
    expect(wrapper.get("button").text()).toBe("Join");
  });

  it("keeps the form and says why when the address cannot be stored", async () => {
    mocks.submitForm.mockRejectedValue({ status: 500 });
    const wrapper = await mountCapture();
    await wrapper.get('input[type="email"]').setValue("ada@example.com");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.get('[role="alert"]').text()).toBe("Your address could not be saved. Please try again.");
  });

  it("carries the same honeypot as the contact form", async () => {
    const wrapper = await mountCapture();

    expect(wrapper.get('input[name="company"]').attributes("tabindex")).toBe("-1");
  });
});

/* Keeps the multi-select type honest for the block that uses it: the field list is a list of values. */
it("stores the contact form's fields as a multiple select", () => {
  const fields = blockOf("ContactForm").properties.fields as IBlockPropertySelectMultiple;

  expect(fields.isMultiple).toBe(true);
  expect(fields.defaultValue).toEqual(["name", "message"]);
});
