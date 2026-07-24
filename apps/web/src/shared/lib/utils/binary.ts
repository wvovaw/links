import { randomString } from "~shared/lib/utils";

export async function urlToFile(url: string): Promise<File> {
  const config = useRuntimeConfig();
  const resolvedUrl = url.startsWith("/") ? `${config.public.backendUrl}${url}` : url;

  const res = await fetch(resolvedUrl);
  const data = await res.blob();

  const file = new File([data], randomString(8), { type: res.headers.get("Content-Type") || "image/jpeg" });
  return file;
}
