export interface TaggedUrlInput {
  /** The site's own address, e.g. `https://links.example`; may carry a trailing slash. */
  base: string;
  slug: string;
  source?: string;
  medium?: string;
  campaign?: string;
}

/** The tag order the dialog prints, which is also the order the owner reads in the address bar. */
const tagNames = ["utm_source", "utm_medium", "utm_campaign"] as const;

/**
 * The page's address with whatever tags the owner filled in. A blank field is an absent field — `?utm_source=`
 * would be a source with no name — so the common case, sharing without tags, is the plain link.
 */
export function taggedUrl({ base, slug, source, medium, campaign }: TaggedUrlInput): string {
  const url = new URL(`${base.replace(/\/+$/, "")}/${slug}`);
  const values = [source, medium, campaign];

  tagNames.forEach((name, index) => {
    const value = values[index]?.trim();
    if (value) url.searchParams.set(name, value);
  });

  return url.href;
}
