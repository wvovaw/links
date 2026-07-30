import { useApiClient } from "../client";
import { getErrorMessage } from "../errors";

export async function deleteLink(id: string) {
  try {
    const api = useApiClient();
    await api(`/links/${id}`, {
      method: "DELETE",
    });
  } catch {
    throw new Error(getErrorMessage("unknown"));
  }
}
