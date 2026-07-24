export function toKebabCase(s: string): string {
  return s && s.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)!.map(x => x.toLowerCase()).join("-");
}

export const randomString = (length = 6) => Math.random().toString(20).substring(2, length);
