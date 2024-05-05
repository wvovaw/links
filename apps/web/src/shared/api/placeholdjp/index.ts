export function getImage(text: string, bg = "fff", fg = "000", w = 300, h = 150) {
  return `https://placehold.jp/30/${fg}/${bg}/${w}x${h}.png?text=${text.replace(/\s/g, "+")}`;
}
