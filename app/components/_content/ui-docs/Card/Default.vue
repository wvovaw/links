<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UICard } from "~ui/Card";
import { UIGroup } from "~ui/Group";
import { UIInput, UIInputHint, UIInputLabel, UIInsertInput } from "~ui/Input";
import { UIInsertSelect } from "~ui/Select";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame variant="outline">
    <UICard.Root class="w-xs">
      <UICard.Header>
        <UICard.Title>Card title</UICard.Title>
        <UICard.Subtitle>Card subtitle</UICard.Subtitle>
      </UICard.Header>
      <UICard.Body class="space-y-5">
        <div>
          <UIInputLabel>Input field</UIInputLabel>
          <UIInput full-width />
          <UIInputHint>And some hint</UIInputHint>
        </div>
        <UIGroup>
          <UIInsertInput label="Name" placeholder="your name" />
          <UIInsertSelect label="Mark">
            <option value="1"> 1 </option>
            <option value="2"> 2 </option>
            <option value="3"> 3 </option>
            <option value="4"> 4 </option>
            <option value="5"> 5 </option>
          </UIInsertSelect>
        </UIGroup>
      </UICard.Body>
      <UICard.Footer class="flex justify-between">
        <UIButton variant="ghost" color="chichi">
          Cancel
        </UIButton>
        <UIButton>Submit</UIButton>
      </UICard.Footer>
    </UICard.Root>
  </PreviewFrame>
</template>
