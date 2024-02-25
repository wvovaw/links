<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIRadioGroup, UIRadioGroupItem } from "~ui/RadioGroup";
</script>

<template>
  <PreviewFrame variant="outline">
    <div class="flex flex-rows flex-wrap justify-around gap-4">
      <div class="border border-beerus rounded-moon-s-md p-4 w-full sm:w-xs bg-gohan">
        <h5 class="text-moon-16 mb-2">
          Define by group
        </h5>
        <UIRadioGroup color="piccolo">
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
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r3" value="4" />
            <label for="r3">Four</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r4" value="5" />
            <label for="r4">Five</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r5" value="6" />
            <label for="r5">Six</label>
          </span>
        </UIRadioGroup>
      </div>
      <div class="border border-beerus rounded-moon-s-md p-4 w-full sm:w-xs bg-gohan">
        <h5 class="text-moon-16 mb-2">
          Override when needed
        </h5>
        <UIRadioGroup color="piccolo">
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r0" value="1" />
            <label for="r0">1</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r1" value="2" />
            <label for="r1">2</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r2" value="3" color="chichi" />
            <label for="r2">3 <i class="text-trunks">(overriden with "chichi")</i></label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r3" value="4" />
            <label for="r3">4</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r4" value="5" color="roshi" />
            <label for="r2">5 <i class="text-trunks">(overriden with "roshi")</i></label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="r5" value="6" />
            <label for="r5">6</label>
          </span>
        </UIRadioGroup>
      </div>
    </div>
  </PreviewFrame>
</template>
