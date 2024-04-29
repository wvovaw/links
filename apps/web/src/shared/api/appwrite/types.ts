import type { Models } from "appwrite";

export type Session = Models.Session;
export type User = Models.User<Models.Preferences>;

export { AppwriteException as ApiException } from "appwrite";
