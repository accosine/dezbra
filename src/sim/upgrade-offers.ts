import {
  isFusionWeapon,
  WEAPON_IDS,
  type WeaponId,
  WEAPONS,
} from "../data/weapons";
import {
  type PerkDefinition,
  type PerkId,
  PERKS,
  type Rarity,
} from "../data/perks";
import { pickRandom, type Random, shuffle } from "../utils/random";
import { pickWeighted, type WeightedEntry } from "../utils/weighted-pick";
import type { GameState } from "./game-state";
import { STEP } from "../utils/numbers";

/** A card offered on level-up. */
export type UpgradeOffer = Readonly<{
  description: string;
  icon: string;
  name: string;
  rarity: Rarity;
}> &
  (
    | Readonly<{ kind: "fusion"; weaponId: WeaponId }>
    | Readonly<{ kind: "newWeapon"; weaponId: WeaponId }>
    | Readonly<{ kind: "perk"; perkId: PerkId }>
    | Readonly<{ kind: "weaponLevel"; weaponId: WeaponId }>
  );

const OFFER_COUNT = 3;
const EPIC_WEAPON_LEVEL = 4;
const RARITY_WEIGHTS: Readonly<Record<Exclude<Rarity, "legendary">, number>> = {
  common: 12,
  epic: 3,
  fusion: 24,
  rare: 6,
};
const LEGENDARY_BASE_WEIGHT = 1;

/** Stable identity of an offer, used to avoid duplicates. */
export const getOfferKey = (offer: UpgradeOffer): string =>
  offer.kind === "perk"
    ? `perk:${offer.perkId}`
    : `${offer.kind}:${offer.weaponId}`;

const ownsWeapon = (state: GameState, weaponId: WeaponId): boolean =>
  state.weapons.some((weapon) => weapon.id === weaponId);

const listFusionOffers = (state: GameState): ReadonlyArray<UpgradeOffer> =>
  WEAPON_IDS.map((weaponId) => WEAPONS[weaponId])
    .filter(
      (weapon) =>
        !ownsWeapon(state, weapon.id) &&
        weapon.recipe !== null &&
        weapon.recipe.every((ingredient) => ownsWeapon(state, ingredient)),
    )
    .map((weapon) => ({
      description: weapon.description,
      icon: weapon.icon,
      kind: "fusion",
      name: weapon.name,
      rarity: "fusion",
      weaponId: weapon.id,
    }));

const PERK_AVAILABILITY: Readonly<
  Partial<Record<PerkId, (state: GameState) => boolean>>
> = {
  explosive: (state) => !state.stats.hasExplosiveRounds,
  pierce: (state) => !state.stats.hasPierce,
  revive: (state) => !state.stats.hasRevive,
  timelock: (state) => !state.stats.hasTimeLock,
};

const isPerkAvailable = (state: GameState, perk: PerkDefinition): boolean =>
  PERK_AVAILABILITY[perk.id]?.(state) ?? true;

const listPerkOffers = (state: GameState): ReadonlyArray<UpgradeOffer> =>
  PERKS.filter((perk) => isPerkAvailable(state, perk)).map((perk) => ({
    description: perk.description,
    icon: perk.icon,
    kind: "perk",
    name: perk.name,
    perkId: perk.id,
    rarity: perk.rarity,
  }));

const listWeaponLevelOffers = (state: GameState): ReadonlyArray<UpgradeOffer> =>
  state.weapons
    .filter((slot) => slot.level < WEAPONS[slot.id].maxLevel)
    .map((slot) => ({
      description: `${WEAPONS[slot.id].description}\nSchaden & Feuerrate verbessert.`,
      icon: WEAPONS[slot.id].icon,
      kind: "weaponLevel",
      name: `${WEAPONS[slot.id].name} LVL ${slot.level + STEP}`,
      rarity: slot.level >= EPIC_WEAPON_LEVEL ? "epic" : "rare",
      weaponId: slot.id,
    }));

const listNewWeaponOffers = (state: GameState): ReadonlyArray<UpgradeOffer> =>
  WEAPON_IDS.map((weaponId) => WEAPONS[weaponId])
    .filter(
      (weapon) => !isFusionWeapon(weapon) && !ownsWeapon(state, weapon.id),
    )
    .map((weapon) => ({
      description: weapon.description,
      icon: weapon.icon,
      kind: "newWeapon",
      name: `${weapon.name} (NEU)`,
      rarity: "rare",
      weaponId: weapon.id,
    }));

const weighOffer = (
  state: GameState,
  offer: UpgradeOffer,
): WeightedEntry<UpgradeOffer> => ({
  element: offer,
  weight:
    offer.rarity === "legendary"
      ? LEGENDARY_BASE_WEIGHT + state.stats.luck
      : RARITY_WEIGHTS[offer.rarity],
});

/** Offers already chosen plus the pool to draw the rest from. */
export type Draft = Readonly<{
  picked: ReadonlyArray<UpgradeOffer>;
  pool: ReadonlyArray<UpgradeOffer>;
}>;

/** Draws weighted offers until three are chosen or the pool runs dry. */
export const draftOffers = (
  state: GameState,
  draft: Draft,
  random: Random,
): ReadonlyArray<UpgradeOffer> => {
  if (draft.picked.length >= OFFER_COUNT) {
    return draft.picked;
  }

  const pickedKeys = new Set(draft.picked.map((offer) => getOfferKey(offer)));
  const pool = draft.pool.filter(
    (offer) => !pickedKeys.has(getOfferKey(offer)),
  );
  const next = pickWeighted(
    random,
    pool.map((offer) => weighOffer(state, offer)),
  );

  return next === undefined
    ? draft.picked
    : draftOffers(state, { picked: [...draft.picked, next], pool }, random);
};

/** Draws three level-up offers: a fusion if one is ready, the rest weighted by rarity. */
export const createUpgradeOffers = (
  state: GameState,
  random: Random,
): ReadonlyArray<UpgradeOffer> => {
  const fusion = pickRandom(random, listFusionOffers(state));
  const pool = [
    ...listPerkOffers(state),
    ...listWeaponLevelOffers(state),
    ...listNewWeaponOffers(state),
  ];

  return shuffle(
    random,
    draftOffers(
      state,
      { picked: fusion === undefined ? [] : [fusion], pool },
      random,
    ),
  );
};

/** Number of offers shown per level-up. */
export const UPGRADE_OFFER_COUNT = OFFER_COUNT;
