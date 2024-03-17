<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIAvatar } from "~ui/Avatar";
</script>

<template>
  <PreviewFrame>
    <div class="w-full flex items-center justify-around">
      <UIAvatar.Root size="xs">
        <UIAvatar.Image
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&fit=crop"
          alt="Artem’s avatar"
        />
        <UIAvatar.Fallback>AS</UIAvatar.Fallback>
      </UIAvatar.Root>

      <UIAvatar.Root size="sm">
        <UIAvatar.Image
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&fit=crop"
          alt="Alexander's avatar"
        />
        <UIAvatar.Fallback>AH</UIAvatar.Fallback>
      </UIAvatar.Root>

      <UIAvatar.Root size="md">
        <UIAvatar.Image
          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&fit=crop"
          alt="Rebecca's avatar"
        />
        <UIAvatar.Fallback>RS</UIAvatar.Fallback>
      </UIAvatar.Root>

      <UIAvatar.Root size="lg">
        <UIAvatar.Image
          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&fit=crop"
          alt="Nikita's avatar"
        />
        <UIAvatar.Fallback>NI</UIAvatar.Fallback>
      </UIAvatar.Root>

      <UIAvatar.Root size="xl">
        <UIAvatar.Image
          src="https://images.mubicdn.net/images/cast_member/3071/cache-3195-1568084972/image-w856.jpg?size=600x"
          alt="Jake's avatar"
        />
        <UIAvatar.Fallback>JG</UIAvatar.Fallback>
      </UIAvatar.Root>

      <UIAvatar.Root size="2xl">
        <UIAvatar.Image
          src="https://relativetime.files.wordpress.com/2013/03/vlcsnap-2013-03-10-16h45m49s181.png"
          alt="Takeshi's avatar"
        />
        <UIAvatar.Fallback>TK</UIAvatar.Fallback>
      </UIAvatar.Root>
    </div>

    <div class="w-full flex items-center justify-around">
      <UIAvatar.Root size="xs">
        <UIAvatar.Fallback>
          <span class="i-lucide:user-2 block" />
        </UIAvatar.Fallback>
      </UIAvatar.Root>

      <UIAvatar.Root size="sm">
        <UIAvatar.Fallback>
          <span class="i-lucide:user-2 block" />
        </UIAvatar.Fallback>
      </UIAvatar.Root>

      <UIAvatar.Root size="md">
        <UIAvatar.Fallback>
          <span class="i-lucide:user-2 block" />
        </UIAvatar.Fallback>
      </UIAvatar.Root>

      <UIAvatar.Root size="lg">
        <UIAvatar.Fallback>
          <span class="i-lucide:user-2 block" />
        </UIAvatar.Fallback>
      </UIAvatar.Root>

      <UIAvatar.Root size="xl">
        <UIAvatar.Fallback>
          <span class="i-lucide:user-2 block" />
        </UIAvatar.Fallback>
      </UIAvatar.Root>

      <UIAvatar.Root size="2xl">
        <UIAvatar.Fallback>
          <span class="i-lucide:user-2 block" />
        </UIAvatar.Fallback>
      </UIAvatar.Root>
    </div>
  </PreviewFrame>
</template>
