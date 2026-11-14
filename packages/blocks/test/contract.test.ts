import { describe, expect, it } from "vitest";

import type { BlockName } from "../src/main";

import { checkBlockUpToDate, migrateBlock } from "../src/main";
import { getBlockModule, registry } from "../src/registry";
import { avatarV0 } from "./fixtures/avatar-v0";
import { buttonV0 } from "./fixtures/button-v0";
import { buttonV1 } from "./fixtures/button-v1";
import { paragraphV0 } from "./fixtures/paragraph-v0";
import { paragraphV2 } from "./fixtures/paragraph-v2";
import { pictureV0 } from "./fixtures/picture-v0";

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

it.each([
  ["Avatar", 0, avatarV0],
  ["Paragraph", 0, paragraphV0],
  ["Paragraph", 2, paragraphV2],
  ["Button", 0, buttonV0],
  ["Button", 1, buttonV1],
  ["Picture", 0, pictureV0],
])("migrates a stored %s block from version %i to the current schema", (name, version, fixture) => {
  const module = getBlockModule(name as BlockName);
  const migrated = migrateBlock(structuredClone(fixture));

  expect(fixture.version).toBe(version);
  expect(migrated.version).toBe(module.BLOCK_VERSION);
  // A stored block that has been through every step must reproduce what the factory writes today:
  // a step that bumps the version without doing its property work otherwise stays green.
  expect(migrated.properties).toEqual(module.createBlock("b1").properties);
});
