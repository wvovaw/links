import type { Component } from "vue";

export default function () {
  const blocksMap = new Map();

  /**
   * @description Asyncronously resolves block's vue component by its name and memoize it
   * @param blockName core block name (Avatar, Button, etc.)
   * @returns resolved Block Vue component
   */
  function resolve(blockName: string): Component {
    if (blocksMap.has(blockName)) {
      return blocksMap.get(blockName);
    }
    else {
      const comp = defineAsyncComponent(() => import(`./${blockName}Block.vue`));
      blocksMap.set(blockName, comp);
      return comp;
    }
  };

  return {
    resolve,
  };
}
