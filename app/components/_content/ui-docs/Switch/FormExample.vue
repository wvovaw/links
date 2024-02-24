<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISwitch } from "~ui/Switch";
import { UIButton } from "~ui/Button";

function handleSubmit(e: SubmitEvent) {
  const { mySwitch } = Object.fromEntries(new FormData(e.target as HTMLFormElement));
  console.log(mySwitch);
}
</script>

<template>
  <PreviewFrame>
    <form
      class="border-(1 beerus) rounded-moon-s-sm max-w-xs w-full p-4 flex flex-col gap-2"
      @submit.prevent="(e) => handleSubmit(e as SubmitEvent)"
    >
      <div class="flex items-center space-x-2">
        <label for="switch">Some switch</label>
        <UISwitch id="switch" size="sm" name="mySwitch" class="self-center" aria-label="Some switch" />
      </div>
      <UIButton type="submit" size="xs">
        Submit
      </UIButton>
    </form>
  </PreviewFrame>
</template>
