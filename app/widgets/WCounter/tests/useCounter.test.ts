import { describe, expect, it } from "vitest";
import useCounter from "../composables/useCounter";

/**
 * useCounter composable unit-test example
 */
describe("useCounter composable", () => {
  const counterStore = useCounter({ init: 12 });

  it("should have initial value", () => {
    expect(counterStore.counter.value).toEqual(12);
  });

  it("should be 13 after increment", () => {
    counterStore.increment();
    expect(counterStore.counter.value).toEqual(13);
  });

  it("should be 12 after decrement", () => {
    counterStore.decrement();
    expect(counterStore.counter.value).toEqual(12);
  });

  it("should be 9 after 3x decrement", () => {
    counterStore.decrement();
    counterStore.decrement();
    counterStore.decrement();
    expect(counterStore.counter.value).toEqual(9);
  });

  it("should be 11 after 2x decrement", () => {
    counterStore.increment();
    counterStore.increment();
    expect(counterStore.counter.value).toEqual(11);
  });
});
