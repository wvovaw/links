import { email as _email, custom, forward, minLength, object, string } from "valibot";

const email = string("Email is required", [
  _email("The email address is invalid"),
]);
const username = string("Username is required.", [
  minLength(3, "Username must be at least 3 chars lenght."),
]);
const password = string("Password is required", [
  minLength(8, "Password must be at least 8 chars length."),
]);

export const signUpSchema = object({
  email,
  username,
  password,
  confirmPassword: string("Confirm password is required"),
}, [
  forward(
    custom(({ password, confirmPassword }) => password === confirmPassword, "Passwords don't match."),
    ["confirmPassword"],
  ),
]);

export const signInSchema = object({
  email,
  password,
});
