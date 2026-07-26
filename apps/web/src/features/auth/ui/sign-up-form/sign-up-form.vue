<script setup lang="ts">
import { UIButton, UIForm, UIInput, useToast } from "@links/ui";
import { toTypedSchema } from "@vee-validate/valibot";
import { useForm } from "vee-validate";
import { signUpSchema } from "../../model/schema";
import { useAuth } from "../../model";

const { push } = useRouter();
const { toast } = useToast();
const { login, register } = useAuth();

const { handleSubmit, isSubmitting } = useForm({ validationSchema: toTypedSchema(signUpSchema) });
const onSubmit = handleSubmit(async (data) => {
  try {
    const email = data.email;
    const username = data.username;
    const password = data.password;

    await register({ email, username, password });
    await login({ email, password });

    push("/links");
  }
  catch (e: unknown) {
    if (e instanceof Error)
      showError(e.message);
  }
});

const signUpError = ref(false);
const { start: setSignUpError } = useTimeoutFn(() => {
  signUpError.value = false;
}, 3000);

function showError(message: string) {
  toast({
    title: "Sign Up Error",
    content: message,
    variant: "error",
  });
  setSignUpError();
}
</script>

<template>
  <form class="w-full space-y-3" @submit.prevent="onSubmit">
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="email">
      <UIForm.Item>
        <UIForm.Label>Email</UIForm.Label>
        <UIForm.Control>
          <UIInput type="email" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" full-width />
        </UIForm.Control>
        <UIForm.ErrorMessage />
      </UIForm.Item>
    </UIForm.Field>
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="username">
      <UIForm.Item>
        <UIForm.Label>Username</UIForm.Label>
        <UIForm.Control>
          <UIInput type="text" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" full-width />
        </UIForm.Control>
        <UIForm.ErrorMessage />
      </UIForm.Item>
    </UIForm.Field>
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="password">
      <UIForm.Item>
        <UIForm.Label>Password</UIForm.Label>
        <UIForm.Control>
          <UIInput type="password" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" full-width />
        </UIForm.Control>
        <UIForm.ErrorMessage />
      </UIForm.Item>
    </UIForm.Field>
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="confirmPassword">
      <UIForm.Item>
        <UIForm.Label>Repeat password</UIForm.Label>
        <UIForm.Control>
          <UIInput type="password" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" full-width />
        </UIForm.Control>
        <UIForm.ErrorMessage />
      </UIForm.Item>
    </UIForm.Field>
    <UIButton type="submit" full-width :loading="isSubmitting" :disabled="isSubmitting" :animation="signUpError ? 'error' : null">
      Submit
    </UIButton>
  </form>
</template>
