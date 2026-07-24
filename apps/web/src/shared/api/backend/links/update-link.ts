import { getErrorMessage } from "../errors";
import { useApiClient } from "../client";
import type { Link, LinkStatus } from "../types";

export interface IUpdateContentData {
  id: string;
  blocks?: unknown[];
  background?: string;
  status?: LinkStatus;
}

export interface IUpdateMetadataData {
  id: string;
  title?: string;
  seo?: Record<string, unknown>;
  status?: LinkStatus;
}

export interface IUpdateSlugData {
  id: string;
  slug: string;
}

export async function updateContent({ id, blocks, background, status }: IUpdateContentData): Promise<Link | undefined> {
  try {
    const api = useApiClient();
    const data = await api<Link>(`/links/${id}/content`, {
      method: "PATCH",
      body: { blocks, background, status },
    });
    return data;
  }
  catch {
    throw new Error(getErrorMessage("unknown"));
  }
}

export async function updateMetadata({ id, title, seo, status }: IUpdateMetadataData): Promise<Link | undefined> {
  try {
    const api = useApiClient();
    const data = await api<Link>(`/links/${id}/metadata`, {
      method: "PATCH",
      body: { title, seo, status },
    });
    return data;
  }
  catch {
    throw new Error(getErrorMessage("unknown"));
  }
}

export async function updateSlug({ id, slug }: IUpdateSlugData): Promise<Link | undefined> {
  try {
    const api = useApiClient();
    const data = await api<Link>(`/links/${id}/slug`, {
      method: "PATCH",
      body: { slug },
    });
    return data;
  }
  catch {
    throw new Error(getErrorMessage("unknown"));
  }
}
