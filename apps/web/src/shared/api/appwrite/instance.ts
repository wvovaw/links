import { Account, Client } from "appwrite";

let client: Client | undefined;

function useApiClient() {
  if (!client) {
    client = new Client();
    const config = useRuntimeConfig();

    client
      .setEndpoint(config.public.appwriteHost)
      .setProject(config.public.appwriteProjectId);
  }
  return client;
}

export function useAccountApi() {
  const account = new Account(useApiClient());
  return account;
}
