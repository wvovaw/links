import { email as _email, minLength, object, optional, string } from "valibot";

const email = optional(string("Email is required", [
  _email("The email address is invalid"),
]));
const username = optional(string("Username is required.", [
  minLength(3, "Username must be at least 3 chars lenght."),
]));

export const profileSettingsSchema = object({
  email,
  username,
});
