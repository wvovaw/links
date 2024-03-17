<template>
  <nav class="border-beerus bg-goku text-bulma h-4rem w-full flex-inline flex-content-between border-(b-1) px-8 py-3">
    <div class="w-fit flex justify-between">
      <slot name="left" />
    </div>
    <div class="flex grow justify-end">
      <slot name="right" />
    </div>
  </nav>
</template>
