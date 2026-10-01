const isObjectLike = (candidate: unknown): candidate is object =>
  typeof candidate === "object" && candidate !== null;

/** Recursively freezes plain objects and arrays so catalogs stay immutable at runtime. */
export const deepFreeze = <Target>(target: Target): Target => {
  if (isObjectLike(target)) {
    for (const nested of Object.values(target)) {
      deepFreeze(nested);
    }

    Object.freeze(target);
  }

  return target;
};
