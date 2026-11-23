export function createRandom(seed = 123456789) {
  let s = (seed === undefined || seed === null ? 123456789 : seed) >>> 0;

  function next() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(n) {
    if (!n || n <= 0) return 0;
    return Math.floor(next() * n);
  }

  function pick(arr) {
    if (!arr || arr.length === 0) return undefined;
    return arr[nextInt(arr.length)];
  }

  return { next, nextInt, pick };
}
