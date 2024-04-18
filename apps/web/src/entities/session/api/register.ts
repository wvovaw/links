import { ID, createAccountApiInstance } from "~shared/api/appwrite";

export interface IUserRegisterData {
  email: string;
  username: string;
  password: string;
}

export async function register({ email, username, password }: IUserRegisterData): Promise<unknown> {
  const api = createAccountApiInstance();
  const data = api.create(ID.unique(), email, password, username);
  return data;
}
