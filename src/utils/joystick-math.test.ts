import { describe, expect, it } from "vitest";
import { readJoystick } from "./joystick-math";

const RADIUS = 44;

describe("readJoystick", (): void => {
  it("rests at the center", (): void => {
    expect(readJoystick({ x: 0, y: 0 }, RADIUS)).toEqual({
      knob: { x: 0, y: 0 },
      movement: { x: 0, y: 0 },
    });
  });

  it("scales movement with the distance inside the radius", (): void => {
    const reading = readJoystick({ x: 22, y: 0 }, RADIUS);

    expect(reading.knob).toEqual({ x: 22, y: 0 });
    expect(reading.movement).toEqual({ x: 0.5, y: 0 });
  });

  it("clamps the knob to the radius", (): void => {
    const reading = readJoystick({ x: 0, y: -100 }, RADIUS);

    expect(reading.knob).toEqual({ x: 0, y: -RADIUS });
    expect(reading.movement).toEqual({ x: 0, y: -1 });
  });
});
