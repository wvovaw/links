<script setup lang="ts">
import { UIButton, UIForm, UIInsertInput } from "@links/ui";
import { toTypedSchema } from "@vee-validate/valibot";
import { useForm } from "vee-validate";
import { createLinkSchema } from "../../model/schema";
import isLinkNameAvailable from "../../api/is-link-name-available";

const { handleSubmit, setFieldError } = useForm({ validationSchema: toTypedSchema(createLinkSchema) });

// Use memoized version of the request
const isLinkAvailableMem = useMemoize(isLinkNameAvailable);
onUnmounted(() => { isLinkAvailableMem.clear(); });

const onSubmit = handleSubmit(async (data) => {
  const available = await isLinkAvailableMem(data.link_name);
  if (!available) {
    setFieldError("link_name", "This link name is taken or unavailable");
    return;
  }

  // TODO: Implement api call creating new link and redirect
  console.log("Submited with: ", data);
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
          />
        </UIForm.Control>
        <UIForm.ErrorMessage v-show="errorMessage" />
        <UIForm.Description v-show="!errorMessage">
          This sentence is a page title, it's important for SEO
        </UIForm.Description>
      </UIForm.Item>
    </UIForm.Field>
    <UIButton type="submit">
      Continue
    </UIButton>
    <span class="text-center text-moon-10-caption text-trunks">All the settings above can be changed after</span>
  </form>
</template>
