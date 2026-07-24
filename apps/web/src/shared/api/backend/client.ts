import type { FetchOptions } from "ofetch";

const REFRESH_TOKEN_KEY = "refresh_token";

export function getRefreshToken(): string | null {
  if (import.meta.client) {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

export function setRefreshToken(token: string) {
  if (import.meta.client) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

export function clearRefreshToken() {
  if (import.meta.client) {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

function isUnauthorized(error: unknown): boolean {
  return Boolean(
    error
    && typeof error === "object"
    && "response" in error
    && (error as { response?: { status?: number } }).response?.status === 401,
  );
}

export function useApiClient() {
  const config = useRuntimeConfig();

  const headers = import.meta.server
    ? useRequestHeaders(["cookie"])
    : undefined;

  const client = $fetch.create({
    baseURL: config.public.backendUrl,
    credentials: "include",
    headers,
  });

  async function refreshSession(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken)
      return false;

    try {
      const data = await client<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
        method: "POST",
        body: { refreshToken },
      });
      setRefreshToken(data.refreshToken);
      return true;
    }
    catch {
      clearRefreshToken();
      return false;
    }
  }

  return async function api<T>(request: string, options?: FetchOptions): Promise<T> {
    try {
      return await client<T>(request, options as never);
    }
    catch (error) {
      if (isUnauthorized(error) && request !== "/auth/refresh") {
        const refreshed = await refreshSession();
        if (refreshed)
          return await client<T>(request, options as never);
      }
      throw error;
    }
  };
}
