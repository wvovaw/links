import { instance } from "../instance";

export interface IUserRegisterRequest {
  username: string;
  password: string;
}

export async function register({ username, password }: IUserRegisterRequest): Promise<unknown> {
  const data = instance("/http/201/User%20created%20successfully", {
    method: "POST",
    body: { username, password },
  });
  return data;
}
