import { useApiClient } from "../client";

/** Stores a video, an audio clip or a pdf and answers the id the page keeps. */
export async function uploadAsset(file: File): Promise<string> {
  const api = useApiClient();
  const formData = new FormData();
  formData.append("file", file);

  const data = await api<{ fileId: string }>("/storage/assets", {
    method: "POST",
    body: formData,
  });

  return data.fileId;
}
