import type { Link } from "../types";

import { useApiClient } from "../client";

export async function listLinks(): Promise<Link[]> {
  const api = useApiClient();
  const data = await api<Link[]>("/links");
  return data;
}
