import { instance } from "../instance";

export interface IUserLoginRequest {
  username: string;
  password: string;
}
export interface IUserLoginResponse {
  id: number;
  email: string;
  username: string;
  token: string;
}

export async function login({ username, password }: IUserLoginRequest): Promise<IUserLoginResponse> {
  const data = instance<IUserLoginResponse>("/auth/login", {
    method: "POST",
    body: {
      username,
      password,
      expiresInMins: 30,
    },
  });
  return data;
}
