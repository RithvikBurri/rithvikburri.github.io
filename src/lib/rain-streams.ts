/**
 * Character streams for the background rain.
 *
 * Instead of drawing a random glyph per cell, each column is assigned a
 * *theme* for one pass down the screen and emits real tokens from it, one
 * character per row, with short gaps between tokens. Read top-to-bottom a
 * trail spells something ("sudo", "0x7ff3a9", "01101001", "=>"), so the
 * texture reads as terminal output rather than noise.
 *
 * Theme weights are the main dial for the overall look. Katakana is kept
 * as a small Matrix-style accent (~10% of glyphs), not the base texture.
 * Pure and deterministic given `rand`, so the mix can be measured offline.
 */

export type Theme = "code" | "hex" | "binary" | "noise" | "kana";

export const THEME_WEIGHTS: Record<Theme, number> = {
  code: 0.4, // shell commands, keywords, operators: the "terminal" read
  hex: 0.26, // addresses and byte dumps
  binary: 0.14, // bit groups
  noise: 0.1, // classic digit/symbol rain texture
  kana: 0.1, // Matrix nod, kept as an accent
};

// prettier-ignore
const KEYWORDS = [
  // shell
  "sudo", "ssh", "git", "grep", "awk", "sed", "curl", "ping", "nmap",
  "chmod", "kill", "cat", "ls", "cd", "tar", "env", "echo", "exec",
  "exit", "root", "bash", "vim", "tmux", "make", "docker", "kubectl",
  // languages
  "def", "fn", "let", "const", "class", "import", "return", "yield",
  "async", "await", "if", "else", "for", "while", "try", "null", "true",
  "false", "void", "int", "struct", "self",
  // data / systems
  "SELECT", "FROM", "WHERE", "JOIN", "tcp", "udp", "http", "tls",
  "auth", "token", "hash", "sha256", "rsa", "key", "api", "json", "pid",
  "tty", "/dev", "/proc", "/bin", "/etc", "/tmp", "EOF", "NaN",
  "127.0.0.1", "200", "404", "0",
];

// prettier-ignore
const OPERATORS = [
  "=>", "->", "::", "!=", "==", "&&", "||", "<<", ">>", "|>", "{}", "[]",
  "()", "</>", "/*", "*/", "//", "#!", "$?", "++", ":=", "...", "~/", "./",
];

const HEX = "0123456789abcdef";
const NOISE = "0123456789{}[]()<>;:=+-*/\\|&^%$#@!?~_";
const KANA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン";

type Rand = () => number;

const pick = <T>(arr: readonly T[] | string, rand: Rand): T =>
  arr[Math.floor(rand() * arr.length)] as T;

const gap = (rand: Rand, min = 1, max = 3) =>
  " ".repeat(min + Math.floor(rand() * (max - min + 1)));

const hexRun = (n: number, rand: Rand) =>
  Array.from({ length: n }, () => pick<string>(HEX, rand)).join("");

/** One token (plus trailing gap) for a theme. Spaces render as empty cells. */
function nextToken(theme: Theme, rand: Rand): string {
  switch (theme) {
    case "code": {
      const r = rand();
      if (r < 0.62) return pick(KEYWORDS, rand) + gap(rand);
      if (r < 0.9) return pick(OPERATORS, rand) + gap(rand);
      return `0x${hexRun(4, rand)}` + gap(rand);
    }
    case "hex":
      return rand() < 0.45
        ? `0x${hexRun(4 + Math.floor(rand() * 5), rand)}` + gap(rand)
        : hexRun(2, rand) + gap(rand, 1, 1);
    case "binary":
      return (
        Array.from({ length: 8 }, () => (rand() < 0.5 ? "0" : "1")).join("") +
        gap(rand, 1, 2)
      );
    case "noise":
      return (
        Array.from({ length: 3 + Math.floor(rand() * 6) }, () =>
          pick<string>(NOISE, rand),
        ).join("") + gap(rand, 1, 4)
      );
    case "kana": {
      // Matrix-style: katakana runs interleaved with digits.
      const n = 2 + Math.floor(rand() * 4);
      let s = "";
      for (let i = 0; i < n; i++)
        s +=
          rand() < 0.75
            ? pick<string>(KANA, rand)
            : pick<string>("0123456789", rand);
      return s + gap(rand, 1, 3);
    }
  }
}

export function pickTheme(rand: Rand): Theme {
  let r = rand();
  for (const [theme, w] of Object.entries(THEME_WEIGHTS) as [Theme, number][]) {
    if ((r -= w) < 0) return theme;
  }
  return "code";
}

/** Returns a function yielding the next character of an endless stream. */
export function createStream(theme: Theme, rand: Rand): () => string {
  let buffer = "";
  let i = 0;
  return () => {
    if (i >= buffer.length) {
      buffer = nextToken(theme, rand);
      i = 0;
    }
    return buffer[i++];
  };
}
