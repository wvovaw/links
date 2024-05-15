<script setup lang="ts">
import { UIButton, UIForm, UIInsertInput, useToast } from "@links/ui";
import { toTypedSchema } from "@vee-validate/valibot";
import { useForm } from "vee-validate";
import { createLinkSchema } from "../../model/schema";
import isLinkNameAvailable from "../../api/is-link-name-available";
import createNewLinkAndName from "../../api/create-new-link-and-name";

const { push } = useRouter();
const toast = useToast();

const { handleSubmit, setFieldError, isSubmitting } = useForm({ validationSchema: toTypedSchema(createLinkSchema) });

// Use memoized version of the request
const isLinkAvailableMem = useMemoize(isLinkNameAvailable);
onUnmounted(() => { isLinkAvailableMem.clear(); });

const onSubmit = handleSubmit(async (data) => {
  const available = await isLinkAvailableMem(data.link_name);
  if (!available) {
    setFieldError("link_name", "This link name is taken or unavailable");
    return;
  }

  try {
    const link = await createNewLinkAndName({ link_name: data.link_name, title: data.title });
    if (link)
      push(`/links/constructor/${link.$id}`);
  }
  catch (e: unknown) {
    if (e instanceof Error) {
      toast({
        title: "Create link error",
        content: e.message,
        variant: "error",
      });
    }
  }
});
</script>

<template>
  <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="link_name">
      <UIForm.Item>
        <UIForm.Control>
          <UIInsertInput
            label="Link short name"
            placeholder="some-unique-word"
            v-bind="componentField"
            :error="!!errorMessage"
            :error-message="errorMessage"
            :disabled="isSubmitting"
          />
        </UIForm.Control>
        <UIForm.ErrorMessage v-show="errorMessage" />
        <UIForm.Description v-show="!errorMessage">
          This word will be in the url to the link
        </UIForm.Description>
      </UIForm.Item>
    </UIForm.Field>
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="title">
      <UIForm.Item>
        <UIForm.Control>
          <UIInsertInput
            label="Link title"
            placeholder="Descriptive page title"
            v-bind="componentField"
            :error="!!errorMessage"
            :error-message="errorMessage"
            :disabled="isSubmitting"
          />
        </UIForm.Control>
        <UIForm.ErrorMessage v-show="errorMessage" />
        <UIForm.Description v-show="!errorMessage">
          This sentence is a page title, it's important for SEO
        </UIForm.Description>
      </UIForm.Item>
    </UIForm.Field>
    <UIButton
      type="submit"
      :loading="isSubmitting"
      icon-pos="right"
      :disabled="isSubmitting"
    >
      Continue
    </UIButton>
    <span class="text-center text-moon-10-caption text-trunks">
      All the settings above can be changed later
    </span>
  </form>
</template>
