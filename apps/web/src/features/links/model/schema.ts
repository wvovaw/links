import { maxLength, minLength, object, regex, string } from "valibot";

/**
Regex checking if the string is a valid slug
 
Examples: example-one, my-awesome-link, hello-world-2024
 */
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const link_name = string("Link name is required.", [
  minLength(3, "Link name must be at least 3 chars lenght."),
  regex(slugRegex, "Link name may only contain lowercase latin letters, digits and dashes."),
]);

const title = string("Link title is required", [
  minLength(12, "Minimal length is 12."),
  maxLength(60, "Title length is limited to 60 chars."),
]);

export const createLinkSchema = object({
  link_name,
  title,
});
