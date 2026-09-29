import { describe, expect, it } from "vitest";
import { deepFreeze } from "./deep-freeze";

const FIRST_INDEX = 0;

describe("deepFreeze", (): void => {
  it("freezes nested objects and arrays", (): void => {
    const catalog = deepFreeze({ nested: { list: [{ name: "pistol" }] } });

    expect(Object.isFrozen(catalog)).toBe(true);
    expect(Object.isFrozen(catalog.nested)).toBe(true);
    expect(Object.isFrozen(catalog.nested.list)).toBe(true);
    expect(Object.isFrozen(catalog.nested.list.at(FIRST_INDEX))).toBe(true);
  });

  it("returns primitive values unchanged", (): void => {
    expect(deepFreeze("pistol")).toBe("pistol");
  });
});
