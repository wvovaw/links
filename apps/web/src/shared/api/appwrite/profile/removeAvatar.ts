import { getErrorMessage } from "../errors";
import { useAccountApi, useStorageApi } from "../instance";
import { ApiException } from "../types";

export async function removeAvatar(): Promise<undefined> {
  try {
    const accountApi = useAccountApi();
    const storageApi = useStorageApi();
    const config = useRuntimeConfig();
    const bucketId = config.public.appwriteUserPicturesBucketId;

    // get the avatar id and delete the file
    const prefs = await accountApi.getPrefs();
    if (prefs.avatarID)
      await storageApi.deleteFile(bucketId, prefs.avatarID);

    delete prefs.avatarID;
    await accountApi.updatePrefs(prefs);
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
