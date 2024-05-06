<script setup lang="ts">
import { UIButton, UICard, UIForm, UIInput, UITag, useToast } from "@links/ui";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/valibot";
import { profileSettingsSchema } from "../model/schema";
import { urlToFile } from "~shared/lib/utils";
import { ImageUploader } from "~shared/ui/image-uploader";
import { SessionModel } from "~entities/session";
import { AccountApi } from "~shared/api/appwrite";
import { useConfirmation } from "~shared/ui/confirmation-dialog";

const { toast } = useToast();

const sessionStore = SessionModel.useSessionStore();
const { user } = storeToRefs(sessionStore);
const { refreshUserData } = sessionStore;

async function initForm() {
  return {
    email: (() => user.value?.email)(),
    username: (() => user.value?.name)(),
    avatar: await (async () => user.value?.avatarUrl ? await urlToFile(user.value?.avatarUrl) : undefined)(),
  };
}

const { handleSubmit, handleReset, resetForm: reinitForm, isSubmitting, isFieldDirty, meta } = useForm({
  validationSchema: toTypedSchema(profileSettingsSchema),
  initialValues: await initForm(),
});
const isFormValidAndDirty = computed(() => meta.value.valid && meta.value.dirty);

const resetForm = handleReset;
const submitForm = handleSubmit(async (values) => {
  try {
    if (isFieldDirty("username") && values.username)
      await AccountApi.updateName({ name: values.username });

    if (isFieldDirty("avatar")) {
      if (values.avatar)
        await AccountApi.updateAvatar({ file: values.avatar });
      else
        await AccountApi.removeAvatar();
    }

    toast({
      title: "Success",
      content: "Profile settings updated successfully",
      variant: "success",
    });
    await refreshUserData();
  }
  catch (e: unknown) {
    if (e instanceof Error)
      showError(e.message);
  }
});

// Set initial values after store finished the api calls
sessionStore.$subscribe(async () => {
  reinitForm({
    values: await initForm(),
  });
});

function showError(message: string) {
  toast({
    title: "Error updating profile settings",
    content: message,
    variant: "error",
  });
}

onBeforeRouteLeave(async () => {
  if (isFormValidAndDirty.value) {
    const { createConfirmation } = useConfirmation();

    const confirmation = createConfirmation({
      title: "Changes will be lost",
      subtitle: "You have unsaved changes",
      content: "Do you want to leave this page? Unsaved changes won't be saved!",
    });

    const { isCanceled } = await confirmation();

    if (isCanceled)
      return false;
    else return true;
  }
  return true;
});
</script>

<template>
  <UICard.Root>
    <UICard.Header>
      <UICard.Title>Profile settings</UICard.Title>
    </UICard.Header>
    <UICard.Body>
      <form>
        <section class="flex flex-col-reverse gap-4 sm:flex-row sm:gap-8">
          <div class="flex-1">
            <UIForm.Field v-slot="{ componentField }" name="username">
              <UIForm.Item>
                <UIForm.Label>Username</UIForm.Label>
                <UIForm.Control>
                  <UIInput v-bind="componentField" full-width />
                </UIForm.Control>
                <UIForm.ErrorMessage />
              </UIForm.Item>
            </UIForm.Field>
            <UIForm.Field v-slot="{ componentField }" name="email">
              <UIForm.Item>
                <UIForm.Label class="flex items-center gap-2">
                  Email <UITag v-if="!user?.emailVerification" variant="outline" color="krillin" size="xs">
                    Unconfirmed
                  </UITag>
                </UIForm.Label>
                <UIForm.Control>
                  <UIInput type="email" v-bind="componentField" full-width disabled />
                </UIForm.Control>
                <UIForm.ErrorMessage />
              </UIForm.Item>
            </UIForm.Field>
          </div>
          <div class="flex flex-col place-content-center items-center sm:min-w-48">
            <UIForm.Field v-slot="{ componentField, handleChange }" name="avatar">
              <UIForm.Item>
                <UIForm.Label>
                  Avatar image
                </UIForm.Label>
                <UIForm.Control>
                  <ImageUploader v-bind="componentField" />
                </UIForm.Control>
                <UIForm.ErrorMessage />
              </UIForm.Item>
              <UIButton
                variant="link"
                class="color-trunks"
                size="lg"
                @click.prevent="handleChange(undefined)"
              >
                Unset avatar
              </UIButton>
            </UIForm.Field>
          </div>
        </section>
      </form>
    </UICard.Body>
    <UICard.Footer class="flex gap-2">
      <UIButton
        :disabled="!isFormValidAndDirty || isSubmitting"
        :loading="isSubmitting"
        @click="submitForm"
      >
        Save
      </UIButton>
      <UIButton variant="ghost" @click="resetForm">
        Reset
      </UIButton>
    </UICard.Footer>
  </UICard.Root>
</template>
