import { defineStore } from "pinia";

export const useGuestsStore = defineStore("guestsStore", () => {
  const guests = ref<string[]>([]);

  function addGuest(name: string) {
    guests.value.push(name);
  }

  return { guests, addGuest };
});
