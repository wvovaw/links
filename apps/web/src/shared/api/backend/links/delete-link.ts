import { getErrorMessage } from "../errors";
import { useApiClient } from "../client";

export async function deleteLink(id: string) {
  try {
    const api = useApiClient();
    await api(`/links/${id}`, {
      method: "DELETE",
    });
  }
  catch {
    throw new Error(getErrorMessage("unknown"));
  }
}
