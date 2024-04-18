<script setup lang="ts">
import { UIButton, UIForm, UIInput, UIInputLabel } from "@links/ui";
import { toTypedSchema } from "@vee-validate/valibot";
import { useForm } from "vee-validate";
import { signUpSchema } from "../../model/schema";
import { SessionModel } from "~entities/session";
import { DummyJsonApi } from "~shared/api";

const { push } = useRouter();
const session = SessionModel.useSessionStore();

const { handleSubmit, isSubmitting } = useForm({ validationSchema: toTypedSchema(signUpSchema) });
const onSubmit = handleSubmit(async (data) => {
  try {
    const username = data.email.slice(0, data.email.indexOf("@"));
    const password = data.password;
    await createAndSetUser({ username, password });
    push("/pages/constructor");
  }
  catch (e: unknown) {
    if (e instanceof Error)
      console.error(e.message);
  }
});

async function createAndSetUser({username, password }: DummyJsonApi.IUserRegisterRequest) {
  await DummyJsonApi.register({ username, password });
  const loginData = await DummyJsonApi.login({ username, password });
  session.login(loginData.token);
}
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
    <UIButton type="submit" full-width :loading="isSubmitting" :disabled="isSubmitting">
      Submit
    </UIButton>
  </form>
</template>
