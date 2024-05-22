import type { Models } from "appwrite";

export type Session = Models.Session;
export type User = Models.User<Models.Preferences> & { avatarUrl?: string };

enum LinkPublishStatus {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
}
// FIXME: "link" field must not have "name" field in it for this type
export interface ILinkNameDocument extends Models.Document {
  // link: Omit<ILinkPageDocument, "name">;
  link: ILinkPageDocument;
}
// FIXME: "name" field must not have "link" field in it for this type
export interface ILinkPageDocument extends Models.Document {
  title: string;
  /** Serialized JSON array */
  blocks: string;
  /** Serialized JSON object */
  seo: string;
  /** Background CSS string */
  background: string;
  status: LinkPublishStatus;
  /**
   * Relation with links_names collection record.
   * Represents a unique short id of the link (ex. https://domain.cc/name)
   */
  // name: Omit<ILinkNameDocument, "link">;
  name: ILinkNameDocument;
}

export { AppwriteException as ApiException } from "appwrite";
