import { Account, Client, Databases, Storage } from "appwrite";

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

export function useStorageApi() {
  const storage = new Storage(useApiClient());
  return storage;
}

export function useDatabaseApi() {
  const db = new Databases(useApiClient());
  return db;
}
