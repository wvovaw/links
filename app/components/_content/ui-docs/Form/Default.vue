<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/valibot";
import { email, integer, maxValue, minValue, number, object, string } from "valibot";
import PreviewFrame from "../PreviewFrame.vue";
import { UIForm } from "~ui/Form";
import { UIInput } from "~ui/Input";
import { UISelect } from "~ui/Select";
import { UIButton } from "~ui/Button";

const formSchema = toTypedSchema(
  object({
    email: string("Email is required", [
      email("The email address is invalid."),
    ]),
    rating: number("Rating is required", [
      integer("Rating value must be integer"),
      minValue(0, "0 is minimum"),
      maxValue(5, "5 is maximum"),
    ]),
  }),
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
    <form @submit.prevent="onSubmit">
      <UIForm.Field v-slot="{ componentField, errorMessage }" name="email">
        <UIForm.Item>
          <UIForm.Label>Email</UIForm.Label>
          <UIForm.Control>
            <UIInput v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage" />
          </UIForm.Control>
          <UIForm.ErrorMessage v-if="errorMessage" />
          <UIForm.Description v-else>
            Your current email address
          </UIForm.Description>
        </UIForm.Item>
      </UIForm.Field>

      <UIForm.Field v-slot="{ componentField, errorMessage }" name="rating">
        <UIForm.Item>
          <UIForm.Label>Rating</UIForm.Label>
          <UIForm.Control>
            <UISelect v-bind="componentField" :error="!!errorMessage" :error-message="errorMessage">
              <option
                v-for="val of Array.from({ length: 6 }, (_, i) => i)"
                :key="val"
                :value="val"
              >
                {{ val }}
              </option>
            </UISelect>
          </UIForm.Control>
          <UIForm.ErrorMessage v-if="!!errorMessage" />
          <UIForm.Description v-else>
            How would you rate this library?
          </UIForm.Description>
        </UIForm.Item>
      </UIForm.Field>

      <UIButton type="submit">
        Submit
      </UIButton>
    </form>
  </PreviewFrame>
</template>
