<template>
  <nav class="h-4rem w-full flex-inline flex-content-between border-(b-1 beerus) bg-goku px-8 py-3 text-bulma">
    <div class="w-fit flex justify-between">
      <slot name="left" />
    </div>
    <div class="flex grow justify-end">
      <slot name="right" />
    </div>
  </nav>
</template>
