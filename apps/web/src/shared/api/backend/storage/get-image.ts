import { useApiClient } from "../client";

export async function getImage(fileId: string): Promise<Blob> {
  const api = useApiClient();

  const data = await api<Blob>(`/storage/images/${fileId}`);

  return data;
}
