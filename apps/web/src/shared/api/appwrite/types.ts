import type { Models } from "appwrite";

export type Session = Models.Session;
export type User = Models.User<Models.Preferences> & { avatarUrl?: string };

enum LinkPublishStatus {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
}
export interface ILinkPageDocument extends Models.Document {
  title: string;
  /** Serialized JSON array */
  blocks: string;
  /** Serialized JSON object */
  seo: string;
  status: LinkPublishStatus;
}

export { AppwriteException as ApiException } from "appwrite";
