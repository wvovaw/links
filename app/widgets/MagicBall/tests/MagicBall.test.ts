// @vitest-environment nuxt

import { describe, expect, it } from "vitest";
import { mountSuspended, registerEndpoint } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import MagicBall from "../MagicBall.vue";

/**
 * MagicBall.vue component-test example with nuxt/test-utils
 */
describe("should get and render an answer from api on button click", async () => {
  const wrapper = await mountSuspended(MagicBall);

  // Mocking api endpoint.
  const eightBallSays = "Yes";
  registerEndpoint("/api/8ball", () => ({ eightBallSays }));

  const btn = wrapper.get("button");

  it(`answer should be '${eightBallSays}' after click`, async () => {
    await btn.trigger("click");
    await flushPromises();
    // or we can do this to wait untill DOM updated
    // await new Promise(res => setTimeout(res, 0));
    const answer = wrapper.get("[data-test='answer']");
    expect(answer.text()).eq(eightBallSays);
  });
});
