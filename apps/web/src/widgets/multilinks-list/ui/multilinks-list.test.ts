import type { LinksListRow } from "../model";

import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it } from "vitest";
import { LinkStatus } from "~shared/api/backend";

import MultilinksList from "./multilinks-list.vue";

/** The dialog and the form behind it ask for a router and a backend; the card's job is to offer them. */
const stubs = {
  NuxtLinkLocale: {
    props: { to: { type: [String, Object], required: true } },
    template: `<a :data-to="JSON.stringify(to)"><slot /></a>`,
  },
  CreateNewLinkDialog: { template: `<div data-create-link><slot /></div>` },
  CreateNewLinkForm: { template: `<form />` },
};

function row(index: number): LinksListRow {
  return {
    id: `l${index}`,
    title: `Page ${index}`,
    slug: `page-${index}`,
    status: LinkStatus.PUBLISHED,
    updatedAt: "2026-11-08T09:00:00.000Z",
    clicks: index,
    visitors: index,
  };
}

const eleven = Array.from({ length: 11 }, (_, index) => row(index + 1));

function mountList(links: LinksListRow[]) {
  return mount(MultilinksList, { props: { links }, global: { stubs, plugins: [createPinia()] } });
}

describe("MultilinksList", () => {
  it("offers the create action above the table", () => {
    expect(mountList(eleven).find("[data-create-link]").exists()).toBe(true);
  });

  it("holds one page of rows and pages the rest", async () => {
    const wrapper = mountList(eleven);

    expect(wrapper.findAll("[data-link-slug]")).toHaveLength(10);
    expect(wrapper.find("[data-link-slug='page-11']").exists()).toBe(false);

    await wrapper.get("[data-page='2']").trigger("click");

    expect(wrapper.findAll("[data-link-slug]")).toHaveLength(1);
    expect(wrapper.find("[data-link-slug='page-11']").exists()).toBe(true);
  });

  /* A delete can take the last page away under the reader; they must land on the list, not on nothing. */
  it("clamps the page when the list shortens under it", async () => {
    const wrapper = mountList(eleven);
    await wrapper.get("[data-page='2']").trigger("click");

    await wrapper.setProps({ links: eleven.slice(0, 10) });

    expect(wrapper.find("[data-link-slug='page-10']").exists()).toBe(true);
    expect(wrapper.find("[data-per-page]").exists()).toBe(true);
  });

  it("shows each page's own numbers, address and update time", () => {
    const wrapper = mountList([row(1)]);
    const line = wrapper.get("[data-link-slug='page-1']");

    expect(line.text()).toContain("Page 1");
    expect(line.text()).toContain("/page-1");
    expect(line.text()).toContain("Nov 8, 2026");
    expect(line.attributes("data-clicks")).toBe("1");
  });

  it("sends a row to its statistics and its constructor", () => {
    const html = mountList([row(1)]).get("[data-link-slug='page-1']").html();

    expect(html).toContain("links-id-stats");
    expect(html).toContain("links-constructor-id");
  });

  /* An owner with no pages gets the invitation, and no pager over an empty list. */
  it("shows the empty state instead of rows and the footer", () => {
    const wrapper = mountList([]);

    expect(wrapper.text()).toContain("You have no links");
    expect(wrapper.find("[data-per-page]").exists()).toBe(false);
  });
});
