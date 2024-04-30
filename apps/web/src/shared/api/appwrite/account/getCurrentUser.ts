import { getErrorMessage } from "../errors";
import { useAccountApi, useStorageApi } from "../instance";
import { ApiException, type User } from "../types";

export async function getCurrentUser(): Promise<User | undefined> {
  try {
    const accountApi = useAccountApi();
    const storageAip = useStorageApi();
    const config = useRuntimeConfig();
    const bucketId = config.public.appwriteUserPicturesBucketId;

    const data = await accountApi.get();
    const { avatarID } = await accountApi.getPrefs();

    let avatar: string | undefined;
    try {
      if (avatarID)
        avatar = storageAip.getFileView(bucketId, avatarID).toString();
    } catch (e) {
      if (e instanceof ApiException)
        throw new Error(getErrorMessage(e.type));
    }

    return { ...data, avatarUrl: avatar };
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
