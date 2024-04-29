import { randomString } from "~shared/lib/utils";

export async function urlToFile(url: string): Promise<File> {
  const res = await fetch(url);
  const data = await res.blob();

  const file = new File([data], randomString(8), { type: res.headers.get("Content-Type") || "image/jpeg" });
  return file;
}
