import { email as _email, check, forward, minLength, object, pipe, string } from "valibot";

const email = pipe(
  string("Email is required"),
  _email("The email address is invalid"),
);
const username = pipe(
  string("Username is required."),
  minLength(3, "Username must be at least 3 chars lenght."),
);
const password = pipe(
  string("Password is required"),
  minLength(8, "Password must be at least 8 chars length."),
);

export const signUpSchema = pipe(
  object({
    email,
    username,
    password,
    confirmPassword: string("Confirm password is required"),
  }),
  forward(
    check(
      ({ password, confirmPassword }) => password === confirmPassword,
      "Passwords don't match.",
    ),
    ["confirmPassword"],
  ),
);

export const signInSchema = object({
  email,
  password,
});
