import { getErrorMessage } from "../errors";
import { clearRefreshToken, getRefreshToken, useApiClient } from "../client";

export async function logout() {
  try {
    const api = useApiClient();
    const refreshToken = getRefreshToken();
    await api("/auth/logout", {
      method: "POST",
      body: { refreshToken },
    });
    clearRefreshToken();
  }
  catch {
    clearRefreshToken();
    throw new Error(getErrorMessage("user_unauthorized"));
  }
}
