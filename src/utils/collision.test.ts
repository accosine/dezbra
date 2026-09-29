import { describe, expect, it } from "vitest";
import { isPointInView, isRectInView, pushCircleOutOfRects } from "./collision";

const WALL = { height: 100, width: 100, x: 100, y: 100 };
const RADIUS = 10;
const VIEW = { height: 50, width: 50, x: 0, y: 0 };
const NO_MARGIN = 0;
const MARGIN = 20;

describe("pushCircleOutOfRects", (): void => {
  it.each([
    { expected: { x: 90, y: 150 }, side: "left", x: 105, y: 150 },
    { expected: { x: 210, y: 150 }, side: "right", x: 195, y: 150 },
    { expected: { x: 150, y: 90 }, side: "top", x: 150, y: 105 },
    { expected: { x: 150, y: 210 }, side: "bottom", x: 150, y: 195 },
  ])("pushes out through the $side side", ({ expected, x, y }): void => {
    expect(pushCircleOutOfRects({ radius: RADIUS, x, y }, [WALL])).toEqual(
      expected,
    );
  });

  it("leaves circles outside every rectangle untouched", (): void => {
    const circle = { radius: RADIUS, x: 20, y: 20 };

    expect(pushCircleOutOfRects(circle, [WALL])).toEqual({ x: 20, y: 20 });
  });
});

describe("view tests", (): void => {
  it("detects rectangles inside and outside the view", (): void => {
    expect(isRectInView(WALL, VIEW, NO_MARGIN)).toBe(false);
    expect(isRectInView({ ...WALL, x: 10, y: 10 }, VIEW, NO_MARGIN)).toBe(true);
  });

  it("respects the margin for points", (): void => {
    const point = { x: 60, y: 10 };

    expect(isPointInView(point, VIEW, NO_MARGIN)).toBe(false);
    expect(isPointInView(point, VIEW, MARGIN)).toBe(true);
  });
});
