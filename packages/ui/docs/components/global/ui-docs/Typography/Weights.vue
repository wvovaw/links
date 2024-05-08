<script setup lang="ts">
import UtilityTag from "../UtilityTag";
</script>

<template>
  <div class="text-moon-20">
    <div class="items-ceneter flex gap-2 font-regular">
      regular
      <span class="text-trunks font-light font-italic">default</span>
      <UtilityTag>font-regular</UtilityTag>
    </div>

    <div class="items-ceneter flex gap-2 font-semibold">
      semibold
      <UtilityTag>font-semibold</UtilityTag>
    </div>
  </div>
</template>
