import { getErrorMessage } from "../errors";
import { useApiClient } from "../client";
import type { Link } from "../types";

export interface ICreateLinkData {
  slug: string;
  title: string;
}

export async function createLink({ slug, title }: ICreateLinkData): Promise<Link | undefined> {
  try {
    const api = useApiClient();
    const data = await api<Link>("/links", {
      method: "POST",
      body: { slug, title },
    });
    return data;
  }
  catch {
    throw new Error(getErrorMessage("unknown"));
  }
}
