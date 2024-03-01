<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput, UIInsertInput } from "~ui/Input";
import { UIInsertSelect, UISelect } from "~ui/Select";
import { UIGroup } from "~ui/Group";
</script>

<template>
  <PreviewFrame>
    <div>
      <UIGroup>
        <UIInput placeholder="You" />
        <UIInsertInput label="Can" placeholder="easily" />
        <UIInput placeholder="group" />
        <UIInsertSelect label="Input elements" :model-value="1">
          <option value="1">
            vertically
          </option>
          <option value="2" disabled>
            and
          </option>
          <option value="3">
            horizontally
          </option>
        </UIInsertSelect>
      </UIGroup>
    </div>
    <div>
      <UIGroup orientation="horizontal">
        <UIInsertInput label="And" placeholder="also" />
        <UIInsertSelect label="Horizontally" :model-value="1">
          <option value="1">
            too
          </option>
        </UIInsertSelect>
      </UIGroup>
    </div>
  </PreviewFrame>
</template>
