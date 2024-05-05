<script setup lang="ts">
import { UIButton } from "@links/ui";
import { useLink } from "../../model";

const { createNewLink } = useLink();
</script>

<template>
  <UIButton
    class="mt-6 px-16" @click="createNewLink"
  >
    Create new link
  </UIButton>
</template>
