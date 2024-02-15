import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useGuestsStore } from "../stores/guests.store";

/**
 * guests.store.ts pinia store unit test
 */
describe("should store guests list and to be able to add a new one", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("can add new guest", () => {
    const store = useGuestsStore();

    expect(store.guests.length).toBe(0);
    store.addGuest("Pinia vitest");
    expect(store.guests.length).toBe(1);
    expect(store.guests[0]).toBe("Pinia vitest");
  });
});
