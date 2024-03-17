<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/valibot";
import { custom, email, forward, minLength, object, string } from "valibot";
import PreviewFrame from "../PreviewFrame.vue";
import { UIForm } from "~ui/Form";
import { UIInsertInput } from "~ui/Input";
import { UIButton } from "~ui/Button";

const formSchema = toTypedSchema(
  object({
    email: string("Email is required.", [
      email("The email address is invalid."),
    ]),
    password: string("Password is required", [
      minLength(8, "Password must be at least 8 chars length."),
    ]),
    confirmPassword: string("Confirm password is required"),
  }, [
    forward(
      custom(({ password, confirmPassword }) => password === confirmPassword, "Passwords don't match."),
      ["confirmPassword"],
    ),
  ]),
);
const form = useForm({
  validationSchema: formSchema,
});
const onSubmit = form.handleSubmit((vals) => {
  console.log(`Form submited!`, vals);
});
</script>

<template>
  <PreviewFrame>
    <form class="w-full max-w-xs bg-gohan p-4 border border-beerus rounded-moon-s-md shadow-moon-md space-y-4" @submit.prevent="onSubmit">
      <UIForm.Field v-slot="{ componentField, errorMessage }" name="email">
        <UIForm.Item>
          <UIForm.Control>
            <UIInsertInput label="Email" type="email" placeholder="user@email.com" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" />
          </UIForm.Control>
          <UIForm.ErrorMessage v-if="errorMessage" />
          <UIForm.Description v-else>
            Your current email address
          </UIForm.Description>
        </UIForm.Item>
      </UIForm.Field>
      <UIForm.Field v-slot="{ componentField, errorMessage }" name="password">
        <UIForm.Item>
          <UIForm.Control>
            <UIInsertInput label="Password" type="password" placeholder="*******" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" />
          </UIForm.Control>
          <UIForm.ErrorMessage v-if="errorMessage" />
          <UIForm.Description v-else>
            Secure password phrase
          </UIForm.Description>
        </UIForm.Item>
      </UIForm.Field>
      <UIForm.Field v-slot="{ componentField, errorMessage }" name="confirmPassword">
        <UIForm.Item>
          <UIForm.Control>
            <UIInsertInput label="Confirm password" type="password" placeholder="*******" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" />
          </UIForm.Control>
          <UIForm.ErrorMessage v-if="errorMessage" />
          <UIForm.Description v-else>
            Confirm password
          </UIForm.Description>
        </UIForm.Item>
      </UIForm.Field>
      <UIButton type="submit" full-width>
        Submit
      </UIButton>
    </form>
  </PreviewFrame>
</template>
