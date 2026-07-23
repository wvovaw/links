import { User } from "./user.entity";

export interface UserDto {
  id: string;
  email: string;
  name: string;
  emailVerification: false;
  avatarUrl?: string;
}

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerification: false,
    ...(user.avatarFileId ? { avatarUrl: `/storage/avatars/${user.avatarFileId}` } : {}),
  };
}
