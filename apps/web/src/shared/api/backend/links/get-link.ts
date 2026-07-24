import { getErrorMessage } from "../errors";
import { useApiClient } from "../client";
import type { Link } from "../types";

export async function getLink(id: string): Promise<Link | undefined> {
  try {
    const api = useApiClient();
    const data = await api<Link>(`/links/${id}`);
    return data;
  }
  catch {
    throw new Error(getErrorMessage("document_not_found"));
  }
}
