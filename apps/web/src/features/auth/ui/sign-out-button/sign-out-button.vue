<script setup lang="ts">
import { Primitive } from "radix-vue";
import { useAuth } from "../../model";

const { push } = useRouter();
const { logout } = useAuth();

function handleSignOutClick() {
  logout();
  push("/sign-in");
}
</script>

<template>
  <Primitive @click="handleSignOutClick">
    <slot>
      Sign Out
    </slot>
  </Primitive>
</template>
