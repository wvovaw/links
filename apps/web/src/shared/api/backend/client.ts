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

export function useApiClient() {
  const config = useRuntimeConfig();

  return $fetch.create({
    baseURL: config.public.backendUrl,
    credentials: "include",
    async onResponseError({ response, request }) {
      if (response.status === 401) {
        const refreshToken = getRefreshToken();
        if (!refreshToken)
          return;

        try {
          const refreshResponse = await $fetch<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
            baseURL: config.public.backendUrl,
            method: "POST",
            body: { refreshToken },
          });

          setRefreshToken(refreshResponse.refreshToken);
          return $fetch(request, {
            baseURL: config.public.backendUrl,
            credentials: "include",
          });
        }
        catch {
          clearRefreshToken();
        }
      }
    },
  });
}
