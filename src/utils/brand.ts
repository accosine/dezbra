declare const brandTag: unique symbol;

/** Nominal type tag that keeps structurally identical IDs from being mixed up. */
export type Brand<Base, Tag extends string> = Base &
  Readonly<{ [brandTag]: Tag }>;
