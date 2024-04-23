<script setup lang="ts">
import { UIButton, UIForm, UIInput, useToast } from "@links/ui";
import { toTypedSchema } from "@vee-validate/valibot";
import { useForm } from "vee-validate";
import { signInSchema, useAuth } from "../../model";

const { push } = useRouter();
const { toast } = useToast();
const { login } = useAuth();

const { handleSubmit, isSubmitting } = useForm({ validationSchema: toTypedSchema(signInSchema) });

const onSubmit = handleSubmit(async (data) => {
  try {
    const email = data.email;
    const password = data.password;

    await login({ email, password });

    push("/pages/constructor");
  }
  catch (e: unknown) {
    if (e instanceof Error)
      showError(e.message);
  }
});

const signInError = ref(false);
const { start: setSignInError } = useTimeoutFn(() => {
  signInError.value = false;
}, 3000);

function showError(message: string) {
  toast({
    title: "Sign In Error",
    content: message,
    variant: "error",
  });
  signInError.value = true;
  setSignInError();
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
    <UIForm.Field v-slot="{ componentField, errorMessage }" name="password">
      <UIForm.Item>
        <UIForm.Label>Password</UIForm.Label>
        <UIForm.Control>
          <UIInput type="password" v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" full-width />
        </UIForm.Control>
        <UIForm.ErrorMessage />
      </UIForm.Item>
    </UIForm.Field>
    <UIButton type="submit" full-width :loading="isSubmitting" :disabled="isSubmitting" :animation="signInError ? 'error' : null">
      Sign In
    </UIButton>
  </form>
</template>
