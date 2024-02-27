<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISelect } from "~ui/Select";
</script>

<template>
  <PreviewFrame>
    <UISelect>
      <optgroup label="first">
        <option value="1">
          1
        </option>
        <option value="2">
          2
        </option>
        <option value="3">
          3
        </option>
      </optgroup>
      <optgroup label="second" disabled>
        <option value="4">
          4
        </option>
        <option value="5">
          5
        </option>
        <option value="6">
          6
        </option>
      </optgroup>
      <optgroup label="third">
        <option value="7">
          7
        </option>
        <option value="8">
          8
        </option>
        <option value="9">
          9
        </option>
      </optgroup>
    </UISelect>
  </PreviewFrame>
</template>
