<script setup lang="ts">
import { UIButton, UIForm, UIInput, UIInputLabel } from "@links/ui";
import { toTypedSchema } from "@vee-validate/valibot";
import { useForm } from "vee-validate";
import { signUpSchema } from "../../model/schema";
import { SessionApi, SessionModel } from "~entities/session";

const { push } = useRouter();
const session = SessionModel.useSessionStore();

const { handleSubmit, isSubmitting } = useForm({ validationSchema: toTypedSchema(signUpSchema) });
const signupError = ref(false);
const onSubmit = handleSubmit(async (data) => {
  try {
    const email = data.email;
    const username = data.username;
    const password = data.password;
    await createAndSetUser({ email, username, password });
    push("/pages/constructor");
  }
  catch (e: unknown) {
    if (e instanceof Error)
      showError(e.message)
  }
});

async function createAndSetUser({ email, username, password }: SessionApi.IUserRegisterData) {
  await SessionApi.register({ email, username, password });
  const loginData = await SessionApi.login({ email, password });
  if (loginData)
    session.login(loginData);
}

let errorTimerId: NodeJS.Timeout;
function showError(message: string) {
  console.error("Error while signing up: ", message);
  signupError.value = true;
  errorTimerId = setTimeout(() => signupError.value = false, 3000);
}

onBeforeUnmount(() => {
  clearTimeout(errorTimerId);
});
</script>

<template>
  <form class="w-full space-y-3" @submit.prevent="onSubmit">
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="email">
      <UIForm.Item>
        <UIInputLabel for="sign-up-email">
          Email
        </UIInputLabel>
        <UIForm.Control>
          <UIInput id="sign-up-email" type="email" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" full-width />
        </UIForm.Control>
        <UIForm.ErrorMessage />
      </UIForm.Item>
    </UIForm.Field>
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="username">
      <UIForm.Item>
        <UIInputLabel for="sign-up-username">
          Username
        </UIInputLabel>
        <UIForm.Control>
          <UIInput id="sign-up-username" type="text" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" full-width />
        </UIForm.Control>
        <UIForm.ErrorMessage />
      </UIForm.Item>
    </UIForm.Field>
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="password">
      <UIForm.Item>
        <UIInputLabel for="sign-up-passworrd">
          Password
        </UIInputLabel>
        <UIForm.Control>
          <UIInput id="sign-up-password" type="password" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" full-width />
        </UIForm.Control>
        <UIForm.ErrorMessage />
      </UIForm.Item>
    </UIForm.Field>
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="confirmPassword">
      <UIForm.Item>
        <UIInputLabel for="sign-up-confirm-password">
          Repeat password
        </UIInputLabel>
        <UIForm.Control>
          <UIInput id="sign-up-confirm-password" type="password" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" full-width />
        </UIForm.Control>
        <UIForm.ErrorMessage />
      </UIForm.Item>
    </UIForm.Field>
    <UIButton type="submit" full-width :loading="isSubmitting" :disabled="isSubmitting" :animation="signupError ? 'error' : null">
      Submit
    </UIButton>
  </form>
</template>
