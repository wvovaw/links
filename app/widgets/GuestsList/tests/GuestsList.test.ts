import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import GuestsList from "../GuestsList.vue";
import { useGuestsStore } from "../stores/guests.store";

/**
 * GuestsList.vue component-test example with @nuxt/test-utils and @pinia/testing
 */
describe("should list out all guests from guests store and be able to add new guest", () => {
  const pinia = createTestingPinia({ createSpy: vi.fn });
  const store = useGuestsStore(pinia);
  const wrapper = mount(GuestsList, {
    global: {
      plugins: [pinia],
    },
  });

  it("can mount", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("can submit a form to trigger addGuest store action", async () => {
    await wrapper.get("input").setValue("Vue Test");
    await wrapper.get("form").trigger("submit");

    expect(store.addGuest).toHaveBeenCalledTimes(1);
  });
});
