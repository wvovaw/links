<script setup lang="ts">
interface IButtonProps {
  color: "red" | "blue";
}
defineProps<IButtonProps>();
</script>

<template>
  <button
    :class="`${color}`"
  >
  <slot />
  </button>
</template>

<style scoped>
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
.red {
  background-color: rgb(200, 0, 0);
  color: rgb(49, 0, 0);
}
.red:hover {
  border-color: rgb(49, 0, 0);
}
.blue {
  background-color: rgb(0, 0, 200);
  color: rgb(0, 0, 49);
}
.blue:hover {
  border-color: rgb(0, 0, 49);
}
</style>