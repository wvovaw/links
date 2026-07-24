import { useApiClient } from "../client";
import type { Link } from "../types";

export async function listLinks(): Promise<Link[]> {
  const api = useApiClient();
  const data = await api<Link[]>("/links");
  return data;
}
