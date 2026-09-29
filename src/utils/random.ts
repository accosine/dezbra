/** Source of uniformly distributed numbers in [0, 1). */
export type Random = () => number;

const LINEAR_CONGRUENTIAL = {
  increment: 49_297,
  modulus: 233_280,
  multiplier: 9301,
};
const HALF = 0.5;
const INCLUSIVE_OFFSET = 1;

/** Creates the deterministic generator of the original game (same seed, same sequence). */
export const createSeededRandom = (seed: number): Random => {
  let current = seed;

  return (): number => {
    current =
      (current * LINEAR_CONGRUENTIAL.multiplier +
        LINEAR_CONGRUENTIAL.increment) %
      LINEAR_CONGRUENTIAL.modulus;

    return current / LINEAR_CONGRUENTIAL.modulus;
  };
};

/** Returns a number in [minimum, maximum). */
export const randomBetween = (
  random: Random,
  minimum: number,
  maximum: number,
): number => minimum + random() * (maximum - minimum);

/** Returns an integer in [0, count). */
export const randomInteger = (random: Random, count: number): number =>
  Math.floor(random() * count);

/** Returns a number in [-width / 2, width / 2). */
export const randomCentered = (random: Random, width: number): number =>
  (random() - HALF) * width;

/** Returns true with the given probability. */
export const randomChance = (random: Random, probability: number): boolean =>
  random() < probability;

/** Picks a random element or undefined for an empty list. */
export const pickRandom = <Element>(
  random: Random,
  elements: ReadonlyArray<Element>,
): Element | undefined => elements[randomInteger(random, elements.length)];

/** Returns a shuffled copy (Fisher–Yates). */
export const shuffle = <Element>(
  random: Random,
  elements: ReadonlyArray<Element>,
): ReadonlyArray<Element> =>
  elements.reduceRight<ReadonlyArray<Element>>((shuffled, _element, index) => {
    const swapIndex = randomInteger(random, index + INCLUSIVE_OFFSET);
    const copy = [...shuffled];
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];

    return copy;
  }, elements);
