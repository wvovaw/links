<template>
  <nav class="w-full h-4rem bg-background text-foreground py-3 px-8 flex-inline flex-content-between border-(b-1 border)">
    <div class="w-fit flex justify-between">
      <slot name="left" />
    </div>
    <div class="w-full flex justify-end">
      <slot name="right" />
    </div>
  </nav>
</template>
