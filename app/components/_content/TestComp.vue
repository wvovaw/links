<script setup lang="ts">
const n = useState("randNum", () => Math.floor(Math.random() * 100));
</script>

<template>
  <div class="border-(1 fg/50) rounded-sm p-2">
    <div>
      This is a Vue component that available in nuxt-content.
      It supports everything from Nuxt and Vue API
      <p>
        Here's an example using `useState` Nuxt composable: {{ n }}
      </p>
    </div>
    <div class="text-sm text-fg/50">
      <slot />
    </div>
  </div>
</template>
