import { describe, expect, it } from "vitest";

import type { BlockName, IBlock } from "../src/main";

import { checkBlockUpToDate, migrateBlock } from "../src/main";
import { getBlockModule, registry } from "../src/registry";
import { avatarV0 } from "./fixtures/avatar-v0";
import { buttonV0 } from "./fixtures/button-v0";
import { buttonV1 } from "./fixtures/button-v1";
import { buttonV2 } from "./fixtures/button-v2";
import { contactFormV0 } from "./fixtures/contact-form-v0";
import { emailCaptureV0 } from "./fixtures/email-capture-v0";
import { faqV0 } from "./fixtures/faq-v0";
import { faqV0Rows } from "./fixtures/faq-v0-rows";
import { galleryV0 } from "./fixtures/gallery-v0";
import { paragraphV0 } from "./fixtures/paragraph-v0";
import { paragraphV2 } from "./fixtures/paragraph-v2";
import { pictureV0 } from "./fixtures/picture-v0";
import { productsV0 } from "./fixtures/products-v0";
import { testimonialsV0 } from "./fixtures/testimonials-v0";

describe.each(Object.values(registry))("$name", (module) => {
  it("creates a block matching its own version and name", () => {
    const block = module.createBlock("b1");
    expect(block.name).toBe(module.name);
    expect(block.version).toBe(module.BLOCK_VERSION);
  });

  it("gives every property a unique id, a type, a label and a default", () => {
    const block = module.createBlock("b1");
    const properties = Object.values(block.properties);
    const ids = properties.map((p) => p.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const property of properties) {
      expect(property.type).toBeTruthy();
      expect(property.label).toBeTruthy();
      expect(property).toHaveProperty("defaultValue");
    }
  });

  it("migrates idempotently and preserves unknown properties", () => {
    const block = module.createBlock("b1");
    block.properties.legacyFlag = {
      id: 99,
      type: "boolean",
      label: "Old",
      defaultValue: false,
      variant: "switch",
    } as never;
    block.version = 0;

    const once = module.migrateBlock(structuredClone(block));
    const twice = module.migrateBlock(structuredClone(once));

    expect(once.version).toBe(module.BLOCK_VERSION);
    expect(twice).toEqual(once);
    expect(once.properties.legacyFlag).toBeDefined();
  });

  it("leaves an up-to-date block alone", () => {
    const block = module.createBlock("b1");
    expect(checkBlockUpToDate(block).upToDate).toBe(true);
  });

  it("has a pinned schema snapshot", () => {
    expect(module.createBlock("b1").properties).toMatchSnapshot();
  });
});

it("keeps a pasted avatar image url when an Avatar migrates", () => {
  const stored = structuredClone(avatarV0);
  stored.properties.image.value = "https://example.com/avatar.png";

  const migrated = migrateBlock(stored);

  expect(migrated.properties.image.type).toBe("image");
  expect(migrated.properties.image.value).toBe("https://example.com/avatar.png");
});

/** A block's properties without the stored `value`: what a schema is, rather than what a page holds. */
function definitionsOf(block: IBlock): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(block.properties).map(([name, property]) => {
      const definition: Partial<typeof property> = { ...property };
      delete definition.value;
      return [name, definition];
    }),
  );
}

it.each([
  ["Avatar", 0, avatarV0],
  ["Paragraph", 0, paragraphV0],
  ["Paragraph", 2, paragraphV2],
  ["Button", 0, buttonV0],
  ["Button", 1, buttonV1],
  ["Button", 2, buttonV2],
  ["Picture", 0, pictureV0],
  ["Faq", 0, faqV0],
  ["Faq", 0, faqV0Rows],
  ["Gallery", 0, galleryV0],
  ["Products", 0, productsV0],
  ["Testimonials", 0, testimonialsV0],
  ["ContactForm", 0, contactFormV0],
  ["EmailCapture", 0, emailCaptureV0],
])("migrates a stored %s block from version %i to the current schema", (name, version, fixture) => {
  const module = getBlockModule(name as BlockName);
  const migrated = migrateBlock(structuredClone(fixture));

  expect(fixture.version).toBe(version);
  expect(migrated.version).toBe(module.BLOCK_VERSION);
  /*
    A stored block that has been through every step must reproduce what the factory writes today: a
    step that bumps the version without doing its property work otherwise stays green. Definitions and
    data are compared apart, because a factory has no opinion about the rows a page carries.
  */
  expect(definitionsOf(migrated)).toEqual(definitionsOf(module.createBlock("b1")));
  /*
    A fixture that stores rows pins them: a migration step that rewrites row data, or drops every row
    it was handed, fails here rather than in a page whose products silently disappeared.
  */
  expect(migrated.properties.items?.value).toEqual(fixture.properties.items?.value);
});

/**
 * A schedule sits on the block rather than in `properties`, so no migration step owns it: migrating a
 * stored page must hand every block back with the visibility it was saved with.
 */
it("keeps a stored visibility schedule when a block migrates", () => {
  const stored = structuredClone(buttonV0);
  const schedule = { hidden: true, from: "2026-01-01T00:00:00.000Z", to: "2026-02-01T00:00:00.000Z" };
  stored.visibility = schedule;

  const migrated = migrateBlock(stored);

  expect(migrated.visibility).toEqual(schedule);
});
