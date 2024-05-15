import { onMounted, onUnmounted } from "vue";

interface Combination {
  key: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"
  | "Backquote" | "Minus" | "Equal" | "BracketLeft" | "BracketRight" | "Backslash" | "Semicolon" | "Quote" | "Comma" | "Period" | "Slash"
  | "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"
  | "Space" | "Tab" | "Enter" | "Escape";
  // | "Numpad0" | "Numpad1" | "Numpad2" | "Numpad3" | "Numpad4" | "Numpad5" | "Numpad6" | "Numpad7" | "Numpad8" | "Numpad9" | "NumpadAdd" | "NumpadSubtract" | "NumpadMultiply" | "NumpadDivide" | "NumpadEnter";
  // | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12"
  // | "Backspace" | "Delete" | "Insert"
  // | "Home" | "End" | "PageUp" | "PageDown"
  modifiers?: ("Shift" | "Control" | "Alt")[];
};

export interface IKeyboardShortcutOptions {
  combination: Combination;
  handler: Function;
}
export default function (options: IKeyboardShortcutOptions) {
  function callback(e: KeyboardEvent) {
    const { code, ctrlKey, shiftKey, altKey } = e;
    const comb = options.combination;

    // handle modifiers
    const modifiersOk = comb.modifiers
      ? comb.modifiers.every((k) => {
        if (k === "Control")
          return ctrlKey;
        if (k === "Shift")
          return shiftKey;
        if (k === "Alt")
          return altKey;

        return false;
      })
      : true;
    // Handle digits and keys (KeyA..KeyZ, Digit0..Digit9)
    const keyOk
    = code.startsWith("Digit")
      ? comb.key === code.replace("Digit", "")
      : code.startsWith("Key")
        ? comb.key === code.replace("Key", "")
        : comb.key === code;

    if (modifiersOk && keyOk) {
      e.preventDefault();
      e.stopPropagation();
      options.handler();
    }
  }

  onMounted(() => {
    document.addEventListener("keydown", callback);
  });
  onUnmounted(() => {
    document.removeEventListener("keydown", callback);
  });
}
