import { DECOR_SHAPES, getDecorDefinition } from "./decor-shapes";
import { describe, expect, it } from "vitest";
import { MAP_IDS, MAPS } from "./maps";

const FIRST_INDEX = 0;
const NONE = 0;

describe("map catalog", (): void => {
  it("lists every map in display order starting with the city", (): void => {
    expect(new Set(MAP_IDS)).toEqual(new Set(Object.keys(MAPS)));
    expect(MAP_IDS.at(FIRST_INDEX)).toBe("city");
    expect(MAPS.city.unlock).toBeNull();
  });

  it("pairs every wall palette with a roof color", (): void => {
    for (const map of Object.values(MAPS)) {
      expect(map.roofColors).toHaveLength(map.wallPalettes.length);
    }
  });

  it("only places known decorations", (): void => {
    for (const decorType of Object.values(MAPS).flatMap(
      (map) => map.decorTypes,
    )) {
      expect(getDecorDefinition(decorType).shapes.length).toBeGreaterThan(NONE);
    }
  });

  it("gives variant colors to decorations that use them", (): void => {
    for (const definition of Object.values(DECOR_SHAPES)) {
      const usesVariant = definition.shapes.some(
        (shape) => shape.color === "variant",
      );

      expect(definition.variantColors.length > NONE).toBe(usesVariant);
    }
  });
});
