import type { Session } from "~shared/api/appwrite";
import { createAccountApiInstance } from "~shared/api/appwrite";

export interface IUserLoginData {
  email: string;
  password: string;
}

export async function login({ email, password }: IUserLoginData): Promise<Session> {
  const api = createAccountApiInstance();
  const data = api.createEmailPasswordSession(email, password);
  return data;
}
