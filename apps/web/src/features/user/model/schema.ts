import { email as _email, instance, maxSize, mimeType, minLength, object, optional, string } from "valibot";

const email = optional(string("Email is required", [
  _email("The email address is invalid"),
]));
const username = optional(string("Username is required.", [
  minLength(3, "Username must be at least 3 chars lenght."),
]));
const avatar = optional(instance(File, [
  mimeType(["image/jpeg", "image/jpg", "image/png"], "Only jpeg and png formats allowed"),
  maxSize(1024 * 1024 * 5, "Maximum size is 5Mb"),
]));

export const profileSettingsSchema = object({
  email,
  username,
  avatar,
});
