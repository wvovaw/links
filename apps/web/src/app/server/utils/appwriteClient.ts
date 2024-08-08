export default function useAppwriteClient() {
  const config = useRuntimeConfig();
  const host = config.public.appwriteHost;
  const api_key = config.appwriteApiKey;
  const project_id = config.public.appwriteProjectId;

  return $fetch.create({
    baseURL: host,
    headers: {
      "X-Appwrite-Project": project_id,
      "Content-Type": "application/json",
      "X-Appwrite-Key": api_key,
    },
  });
}
