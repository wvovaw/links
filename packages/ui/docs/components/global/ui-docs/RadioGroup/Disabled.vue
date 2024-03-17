<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIRadioGroup, UIRadioGroupItem } from "~ui/RadioGroup";
</script>

<template>
  <PreviewFrame variant="outline">
    <div class="flex-rows flex flex-wrap justify-around gap-4">
      <div class="w-full border border-beerus rounded-moon-s-md bg-gohan p-4 sm:w-xs">
        <h5 class="mb-2 text-moon-16">
          Disable full group
        </h5>
        <UIRadioGroup disabled>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="disabled-00" value="1" />
            <label for="disabled-00">One</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="disabled-01" value="2" />
            <label for="disabled-01">Two</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="disabled-02" value="3" />
            <label for="disabled-02">Three</label>
          </span>
        </UIRadioGroup>
      </div>
      <div class="w-full border border-beerus rounded-moon-s-md bg-gohan p-4 sm:w-xs">
        <h5 class="mb-2 text-moon-16">
          Disable particular items
        </h5>
        <UIRadioGroup color="piccolo">
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="disabled-10" value="1" />
            <label for="disabled-10">1</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="disabled-11" value="2" disabled />
            <label for="disabled-11">2 <i class="text-trunks">(explicitly disabled)</i></label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="disabled-12" value="3" color="chichi" />
            <label for="disabled-12">3</label>
          </span>
        </UIRadioGroup>
      </div>
    </div>
  </PreviewFrame>
</template>
