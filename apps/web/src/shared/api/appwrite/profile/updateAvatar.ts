import { getErrorMessage } from "../errors";
import { useAccountApi, useStorageApi } from "../instance";
import { ApiException } from "../types";
import { randomString } from "~shared/lib/utils";

export interface IUserUpdateAvatarData {
  file: File;
}

export async function updateAvatar({ file }: IUserUpdateAvatarData): Promise<undefined> {
  try {
    const accountApi = useAccountApi();
    const storageApi = useStorageApi();
    const config = useRuntimeConfig();
    const bucketId = config.public.appwriteUserPicturesBucketId;

    // get old avatar id
    const { avatarID: oldAvatarId } = await accountApi.getPrefs();

    // upload new avatar and set perfs
    const newAvatar = await storageApi.createFile(bucketId, randomString(16), file);

    // update prefs.avatarID field
    const prefs = await accountApi.getPrefs();
    await accountApi.updatePrefs({
      ...prefs,
      avatarID: newAvatar.$id,
    });

    // delete the old avatar file
    if (oldAvatarId)
      await storageApi.deleteFile(bucketId, oldAvatarId);
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
