import { custom, email, forward, minLength, object, string } from "valibot";

export const signUpSchema = object({
  email: string("Email is required.", [
    email("The email address is invalid."),
  ]),
  password: string("Password is required", [
    minLength(8, "Password must be at least 8 chars length."),
  ]),
  confirmPassword: string("Confirm password is required"),
}, [
  forward(
    custom(({ password, confirmPassword }) => password === confirmPassword, "Passwords don't match."),
    ["confirmPassword"],
  ),
]);
