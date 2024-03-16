export function randomString(length: number) {
  return Array(length)
    .fill("")
    .map(_ => Math.random().toString(36).charAt(2))
    .join("");
}

export function randomTrueOrFalse() {
  return Math.random() > 0.5;
}

export function randomIntFromInterval(n: number, m: number) {
  return Math.floor(Math.random() * m) + n;
}

export function yachtShuffle<T>(v: T[], r = [...v]): T[] {
  return v.map(() =>
    r.splice(~~(Math.random() * r.length), 1)[0],
  );
}
