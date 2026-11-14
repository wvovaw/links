import type { PageTheme } from "@links/blocks";

import type { Link, LinkStatus } from "../types";

import { useApiClient } from "../client";
import { getErrorMessage } from "../errors";

export interface IUpdateContentData {
  id: string;
  blocks?: unknown[];
  status?: LinkStatus;
  imageFileIds?: string[];
}

export interface IUpdateThemeData {
  id: string;
  theme: PageTheme;
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

export async function updateContent({
  id,
  blocks,
  status,
  imageFileIds,
}: IUpdateContentData): Promise<Link | undefined> {
  try {
    const api = useApiClient();
    const data = await api<Link>(`/links/${id}/content`, {
      method: "PATCH",
      body: { blocks, status, imageFileIds },
    });
    return data;
  } catch {
    throw new Error(getErrorMessage("unknown"));
  }
}

/** The theme endpoint stores the whole theme at once; every field is required. */
export async function updateTheme({ id, theme }: IUpdateThemeData): Promise<Link | undefined> {
  try {
    const api = useApiClient();
    const data = await api<Link>(`/links/${id}/theme`, {
      method: "PATCH",
      body: theme,
    });
    return data;
  } catch {
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
  } catch {
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
  } catch {
    throw new Error(getErrorMessage("unknown"));
  }
}
