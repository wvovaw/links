import { getErrorMessage } from "./errors";
import {
  ApiException,
  type User,
  useAccountApi,
} from "~shared/api/appwrite";

export interface IUserUpdateNameData {
  name: string;
}

export async function updateName({ name }: IUserUpdateNameData): Promise<User | undefined> {
  try {
    const api = useAccountApi();
    const data = await api.updateName(name);
    return data;
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
