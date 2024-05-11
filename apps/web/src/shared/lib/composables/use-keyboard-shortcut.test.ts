import { afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import useKeyboardShortcut from "./use-keyboard-shortcut";
import type { IKeyboardShortcutOptions } from "./use-keyboard-shortcut";

function mountWithKeyboardShortcut(options: IKeyboardShortcutOptions) {
  const wrapper = mount({
    setup() {
      useKeyboardShortcut(options);
    },
    template: "<div></div>",
  });

  return wrapper;
}

describe("useKeyboardShortcut composible", () => {
  afterEach(() => { vi.clearAllMocks(); });

  vi.spyOn(document, "addEventListener");
  vi.spyOn(document, "removeEventListener");

  it("can mount and add event listener on mount and remove it on unmount", () => {
    const wrapper = mountWithKeyboardShortcut({
      combination: { key: "Y", modifiers: ["Control"] },
      handler: vi.fn(),
    });

    expect(wrapper.vm).toBeTruthy();
    expect(document.addEventListener).toBeCalledTimes(1);
    wrapper.unmount();
    expect(document.removeEventListener).toBeCalledTimes(1);
  });

  const testCases: IKeyboardShortcutOptions["combination"][] = [
    { key: "A" },
    { key: "A", modifiers: ["Control"] },
    { key: "A", modifiers: ["Control", "Shift"] },
    { key: "A", modifiers: ["Control", "Shift", "Alt"] },
    { key: "A", modifiers: ["Shift"] },
    { key: "A", modifiers: ["Shift", "Alt"] },
    { key: "A", modifiers: ["Shift", "Alt", "Control"] },
    { key: "A", modifiers: ["Alt"] },
    { key: "A", modifiers: ["Alt", "Control"] },
    { key: "A", modifiers: ["Alt", "Control", "Shift"] },
    { key: "1", modifiers: ["Shift"] },
    { key: "2", modifiers: ["Alt", "Control"] },
    { key: "3", modifiers: ["Shift", "Alt"] },
    { key: "Enter" },
    { key: "Semicolon", modifiers: ["Control"] },
    { key: "Backquote", modifiers: ["Control"] },
    { key: "BracketRight", modifiers: ["Alt", "Shift"] },
    { key: "ArrowDown", modifiers: ["Alt", "Control", "Shift"] },
    { key: "Escape", modifiers: ["Alt", "Control", "Shift"] },
  ];

  describe("trigger callback when the correct combination triggered", () => {
    testCases.forEach((combination) => {
      const message = combination.modifiers && combination.modifiers.length
        ? `[${combination.modifiers.join(" + ")} + ${combination.key}]`
        : `[${combination.key}]`;
      it(message, async () => {
        const mockHandler = vi.fn();
        mountWithKeyboardShortcut({
          combination,
          handler: mockHandler,
        });

        document.dispatchEvent(new KeyboardEvent("keydown", {
          code: `Key${combination.key}`,
          ctrlKey: combination.modifiers?.includes("Control"),
          shiftKey: combination.modifiers?.includes("Shift"),
          altKey: combination.modifiers?.includes("Alt"),
        }));

        expect(mockHandler).toBeCalledTimes(1);
      });
    });
  });

  describe("don't trigger callback if key is missed", () => {
    testCases.forEach((combination) => {
      const message = combination.modifiers && combination.modifiers.length
        ? `[${combination.modifiers.join(" + ")} + ${combination.key}] (${combination.key} is not pressed)`
        : `[${combination.key}] (${combination.key} is not pressed)`;
      it(message, async () => {
        const mockHandler = vi.fn();
        mountWithKeyboardShortcut({
          combination,
          handler: mockHandler,
        });

        document.dispatchEvent(new KeyboardEvent("keydown", {
          // code: `Key${combination.key}`, KEY IS MISSED
          ctrlKey: combination.modifiers?.includes("Control"),
          shiftKey: combination.modifiers?.includes("Shift"),
          altKey: combination.modifiers?.includes("Alt"),
        }));

        expect(mockHandler).not.toBeCalled();
      });
    });
  });

  describe("don't trigger callback if one of the modifiers is missed", () => {
    testCases.forEach((combination) => {
      const message = combination.modifiers && combination.modifiers.length
        ? `[${combination.modifiers.join(" + ")} + ${combination.key}] (${combination.modifiers[0]} is not pressed)`
        : `[${combination.key}] (${combination.key} is not pressed)`;
      it(message, async () => {
        const mockHandler = vi.fn();
        mountWithKeyboardShortcut({
          combination,
          handler: mockHandler,
        });

        // testing only if modifiers exists slicing out the first element
        if (combination.modifiers) {
          document.dispatchEvent(new KeyboardEvent("keydown", {
            code: `Key${combination.key}`,
            ctrlKey: combination.modifiers?.slice(1).includes("Control"),
            shiftKey: combination.modifiers?.slice(1).includes("Shift"),
            altKey: combination.modifiers?.slice(1).includes("Alt"),
          }));

          expect(mockHandler).not.toBeCalled();
        }
      });
    });
  });
});
