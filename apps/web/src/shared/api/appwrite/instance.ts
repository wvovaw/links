import { Account, Client } from "appwrite";

export function createAccountApiInstance() {
  const client = new Client();
  const config = useRuntimeConfig();

  client
    .setEndpoint(config.public.appwriteHost)
    .setProject(config.public.appwriteProjectId);

  const account = new Account(client);

  return account;
}
export { ID } from "appwrite";
