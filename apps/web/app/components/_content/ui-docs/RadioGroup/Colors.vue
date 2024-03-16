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
            <UIRadioGroupItem id="colors-00" value="1" />
            <label for="colors-00">One</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-01" value="2" />
            <label for="colors-01">Two</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-02" value="3" />
            <label for="colors-02">Three</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-03" value="4" />
            <label for="colors-03">Four</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-04" value="5" />
            <label for="colors-04">Five</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-05" value="6" />
            <label for="colors-05">Six</label>
          </span>
        </UIRadioGroup>
      </div>
      <div class="border border-beerus rounded-moon-s-md p-4 w-full sm:w-xs bg-gohan">
        <h5 class="text-moon-16 mb-2">
          Override when needed
        </h5>
        <UIRadioGroup color="piccolo">
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-10" value="1" />
            <label for="colors-10">1</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-11" value="2" />
            <label for="colors-11">2</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-12" value="3" color="chichi" />
            <label for="colors-12">3 <i class="text-trunks">(overriden with "chichi")</i></label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-13" value="4" />
            <label for="colors-13">4</label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-14" value="5" color="roshi" />
            <label for="colors-14">5 <i class="text-trunks">(overriden with "roshi")</i></label>
          </span>
          <span class="flex items-center space-x-2">
            <UIRadioGroupItem id="colors-15" value="6" />
            <label for="colors-15">6</label>
          </span>
        </UIRadioGroup>
      </div>
    </div>
  </PreviewFrame>
</template>
