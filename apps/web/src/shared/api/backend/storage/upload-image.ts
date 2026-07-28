import { useApiClient } from "../client";

export async function uploadImage(file: File): Promise<string> {
  const api = useApiClient();
  const formData = new FormData();
  formData.append("file", file);

  const data = await api<{ fileId: string }>("/storage/images", {
    method: "POST",
    body: formData,
  });

  return data.fileId;
}
