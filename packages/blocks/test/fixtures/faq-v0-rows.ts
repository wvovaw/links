import type { IBlockPropertyList } from "../../src/types";

import { faqV0 } from "./faq-v0";

/**
 * A stored faq that already carries rows: the version 0 schema with the words an owner typed into two
 * of them. It is the template for pinning a migration that rewrites row data — the definition-only
 * comparison in `contract.test.ts` cannot see a step that drops every stored row.
 */
export const faqV0Rows: typeof faqV0 = structuredClone(faqV0);

(faqV0Rows.properties.items as IBlockPropertyList).value = [
  { question: "Do you ship abroad?", answer: "Yes, to most countries." },
  { question: "Can I return an item?", answer: "Within 30 days, unused." },
];
