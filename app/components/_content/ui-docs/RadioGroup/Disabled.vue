<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIRadioGroup, UIRadioGroupItem } from "~ui/RadioGroup";
</script>

<template>
  <PreviewFrame variant="outline">
    <div class="flex flex-rows flex-wrap justify-around gap-4">
      <div class="border border-beerus rounded-moon-s-md p-4 w-full sm:w-xs bg-gohan">
        <h5 class="text-moon-16 mb-2">
          Disable full group
        </h5>
        <UIRadioGroup disabled>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r0" value="1" />
            <label for="r0">One</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r1" value="2" />
            <label for="r1">Two</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r2" value="3" />
            <label for="r2">Three</label>
          </span>
        </UIRadioGroup>
      </div>
      <div class="border border-beerus rounded-moon-s-md p-4 w-full sm:w-xs bg-gohan">
        <h5 class="text-moon-16 mb-2">
          Disable particular items
        </h5>
        <UIRadioGroup color="piccolo">
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r0" value="1" />
            <label for="r0">1</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r1" value="2" disabled />
            <label for="r1">2 <i class="text-trunks">(explicitly disabled)</i></label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r2" value="3" color="chichi" />
            <label for="r2">3</label>
          </span>
        </UIRadioGroup>
      </div>
    </div>
  </PreviewFrame>
</template>
