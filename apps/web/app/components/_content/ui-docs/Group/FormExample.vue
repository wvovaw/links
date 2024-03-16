<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput, UIInsertInput } from "~ui/Input";
import { UIInsertSelect, UISelect } from "~ui/Select";
import { UIGroup } from "~ui/Group";
import { UIButton } from "~ui/Button";

function handleSubmit(e: SubmitEvent) {
  const formData = new FormData(e.target as HTMLFormElement);
  const form: Record<string, any> = {};
  formData.forEach((val, key) => form[key] = val);
  console.log(form);
}
</script>

<template>
  <PreviewFrame>
    <form class="flex flex-col gap-4 w-sm" @submit.prevent="(e: Event) => handleSubmit(e as SubmitEvent)">
      <UIGroup>
        <UIInsertInput name="name" label="First Name" placeholder="You name" required />
        <UIInsertInput name="surname" label="Last Name" placeholder="Your surname" required />
      </UIGroup>

      <UIGroup orientation="horizontal">
        <UIInsertInput name="birth_date" type="date" label="Birth date" full-width />
        <UIInsertInput name="birth_time" type="time" label="Birth time" full-width />
      </UIGroup>

      <UIInsertSelect name="location" label="Location">
        <optgroup label="Europe">
          <option value="germany">
            Germany
          </option>
          <option value="france">
            France
          </option>
          <option value="italy">
            Italy
          </option>
        </optgroup>
        <optgroup label="Asia">
          <option value="china">
            China
          </option>
          <option value="japan">
            Japan
          </option>
          <option value="south korea">
            South Korea
          </option>
        </optgroup>
      </UIInsertSelect>

      <UIGroup orientation="horizontal">
        <UISelect name="gender" required>
          <option value="male">
            male
          </option>
          <option value="female">
            female
          </option>
        </UISelect>
        <UIInput name="fav_number" type="number" placeholder="favorite number" required />
      </UIGroup>

      <UIButton type="submit" icon="i-lucide:send" icon-pos="right" full-width>
        Submit
      </UIButton>
    </form>
  </PreviewFrame>
</template>
