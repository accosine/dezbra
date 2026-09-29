import { describe, expect, it } from "vitest";
import { computeCameraScroll } from "./camera";

const WORLD = 1000;
const VIEW = { height: 200, width: 100 };

describe("computeCameraScroll", (): void => {
  it.each([
    { expected: { x: 450, y: 400 }, target: { x: 500, y: 500 } },
    { expected: { x: 0, y: 0 }, target: { x: 10, y: 10 } },
    { expected: { x: 900, y: 800 }, target: { x: 990, y: 990 } },
  ])("scrolls to $expected for $target", ({ expected, target }): void => {
    expect(computeCameraScroll(target, WORLD, VIEW)).toEqual(expected);
  });
});
