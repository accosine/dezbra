import type { Random } from "./random";

const NO_WEIGHT = 0;
const LAST_INDEX = -1;

/** An element together with its relative selection weight. */
export type WeightedEntry<Element> = Readonly<{
  element: Element;
  weight: number;
}>;

/** Picks an element with probability proportional to its weight. */
export const pickWeighted = <Element>(
  random: Random,
  entries: ReadonlyArray<WeightedEntry<Element>>,
): Element | undefined => {
  const totalWeight = entries.reduce(
    (sum, entry) => sum + entry.weight,
    NO_WEIGHT,
  );
  let remaining = random() * totalWeight;

  const picked = entries.find((entry): boolean => {
    remaining -= entry.weight;

    return remaining <= NO_WEIGHT;
  });

  return (picked ?? entries.at(LAST_INDEX))?.element;
};
