import type { PixelSprite } from "../pixel-sprite";

/** Klassischer Schlurfer — grünlich, zerrissenes Hemd. */
export const SHAMBLER_ZOMBIE_SPRITE: PixelSprite = {
  palette: [
    ["a", "#5aac48"],
    ["b", "#6cbe58"],
    ["c", "#e02020"],
    ["d", "#7cd068"],
    ["e", "#483820"],
    ["f", "#3c2814"],
    ["g", "#584830"],
    ["h", "#ff2020"],
    ["i", "#583830"],
    ["j", "#2c1a08"],
    ["k", "#1c0a00"],
  ],
  rows: [
    ".aaaaa.",
    "abcaca.",
    "adaaaa.",
    ".efffe.",
    "egeheig",
    ".feeee.",
    ".jf..fj",
    ".jf..fj",
    ".kj..jk",
    ".kj..jk",
    ".......",
    ".......",
  ],
};

/** Aufgedunsener Wasserleichen-Zombie — bläulich. */
export const BLOATED_ZOMBIE_SPRITE: PixelSprite = {
  palette: [
    ["a", "#7a9ab0"],
    ["b", "#8aaac0"],
    ["c", "#ff9090"],
    ["d", "#9abbd0"],
    ["e", "#28384a"],
    ["f", "#182838"],
    ["g", "#384858"],
    ["h", "#aa3030"],
    ["i", "#101820"],
    ["j", "#080e16"],
  ],
  rows: [
    ".abbba.",
    "abcbca.",
    "bdbbbd.",
    ".eeeee.",
    "fgfhfg.",
    ".eggge.",
    ".if..fi",
    ".if..fi",
    ".ji..ij",
    ".ji..ij",
    ".......",
    ".......",
  ],
};

/** Dunkler Sprinter — sehr dunkel, ohne Hemd. */
export const SPRINTER_ZOMBIE_SPRITE: PixelSprite = {
  palette: [
    ["a", "#3a5a2c"],
    ["b", "#4a6a38"],
    ["c", "#dd2020"],
    ["d", "#5a7a48"],
    ["e", "#2a1a0c"],
    ["f", "#1a0a00"],
    ["g", "#382818"],
    ["h", "#cc2020"],
    ["i", "#100800"],
    ["j", "#080400"],
  ],
  rows: [
    ".abbba.",
    "abcbca.",
    "bdbbbd.",
    ".eeeee.",
    "fgeheg.",
    ".eeeee.",
    ".if..fi",
    ".if..fi",
    ".ji..ij",
    ".ji..ij",
    ".......",
    ".......",
  ],
};

/** Brute — blass und groß (für große Gegner). */
export const BRUTE_ZOMBIE_SPRITE: PixelSprite = {
  palette: [
    ["a", "#ccc8a8"],
    ["b", "#dcd8b8"],
    ["c", "#ff3030"],
    ["d", "#ece8c8"],
    ["e", "#3c1a00"],
    ["f", "#6c4a20"],
    ["g", "#4c2a10"],
    ["h", "#281008"],
    ["i", "#180800"],
  ],
  rows: [
    ".abbba.",
    "abcbca.",
    "adaaad.",
    "abaaaba",
    "efgegf.",
    ".ggggg.",
    ".he..eh",
    ".he..eh",
    ".ih..hi",
    ".ih..hi",
    ".......",
    ".......",
  ],
};
