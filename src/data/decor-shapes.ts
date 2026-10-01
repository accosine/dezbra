import { CEMETERY_DECOR } from "./decor-cemetery";
import { CITY_DECOR } from "./decor-city";
import { COMMON_DECOR } from "./decor-common";
import type { DecorDefinition } from "./decor-shape";
import { deepFreeze } from "../utils/deep-freeze";
import { INDUSTRIAL_DECOR } from "./decor-industrial";
import { WASTELAND_DECOR } from "./decor-wasteland";

/** Every decoration catalog merged into one lookup. */
export const DECOR_SHAPES = deepFreeze({
  ...COMMON_DECOR,
  ...CITY_DECOR,
  ...INDUSTRIAL_DECOR,
  ...CEMETERY_DECOR,
  ...WASTELAND_DECOR,
});

/** Identifier of a decoration type. */
export type DecorType = keyof typeof DECOR_SHAPES;

/** Returns the definition of a decoration type. */
export const getDecorDefinition = (type: DecorType): DecorDefinition =>
  DECOR_SHAPES[type];
