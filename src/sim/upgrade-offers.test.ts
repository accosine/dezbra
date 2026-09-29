import { createSeededRandom, type Random } from "../utils/random";
import {
  createUpgradeOffers,
  draftOffers,
  getOfferKey,
  type UpgradeOffer,
} from "./upgrade-offers";
import { describe, expect, it } from "vitest";
import { createTestState } from "./sim-fixtures";
import type { GameState } from "./game-state";

const SEED = 42;
const DRAWS = 40;
const OFFER_COUNT = 3;
const EPIC_LEVEL = 4;
const MAX_LEVEL = 5;
const SINGLE = 1;

const drawMany = (
  state: GameState,
  random: Random = createSeededRandom(SEED),
): ReadonlyArray<UpgradeOffer> =>
  Array.from({ length: DRAWS }, () =>
    createUpgradeOffers(state, random),
  ).flat();

const withStats = (
  state: GameState,
  stats: Partial<GameState["stats"]>,
): GameState => ({
  ...state,
  stats: { ...state.stats, ...stats },
});

const withWeapons = (
  state: GameState,
  weapons: GameState["weapons"],
): GameState => ({ ...state, weapons });

describe("createUpgradeOffers", (): void => {
  it("offers three different cards", (): void => {
    const offers = createUpgradeOffers(
      createTestState(),
      createSeededRandom(SEED),
    );

    expect(offers).toHaveLength(OFFER_COUNT);
    const keys = new Set(offers.map((offer) => getOfferKey(offer)));

    expect(keys.size).toBe(OFFER_COUNT);
  });

  it("always offers a ready fusion", (): void => {
    const state = withWeapons(createTestState(), [
      { cooldownTicks: null, id: "uzi", level: SINGLE },
      { cooldownTicks: null, id: "shotgun", level: SINGLE },
    ]);

    expect(
      createUpgradeOffers(state, createSeededRandom(SEED)).map((offer) =>
        getOfferKey(offer),
      ),
    ).toContain("fusion:hellfire");
  });

  it("never offers owned one-time perks", (): void => {
    const state = withStats(createTestState(), {
      hasExplosiveRounds: true,
      hasPierce: true,
      hasRevive: true,
      hasTimeLock: true,
    });
    const keys = drawMany(state).map((offer) => getOfferKey(offer));

    expect(
      keys.filter((key) =>
        [
          "perk:explosive",
          "perk:pierce",
          "perk:revive",
          "perk:timelock",
        ].includes(key),
      ),
    ).toEqual([]);
  });
});

describe("createUpgradeOffers weapons", (): void => {
  it("offers weapon levels with rising rarity and new weapons", (): void => {
    const offers = drawMany(
      withWeapons(createTestState(), [
        { cooldownTicks: null, id: "pistol", level: SINGLE },
        { cooldownTicks: null, id: "uzi", level: EPIC_LEVEL },
        { cooldownTicks: null, id: "laser", level: MAX_LEVEL },
      ]),
    );

    expect(offers).toContainEqual(
      expect.objectContaining({ name: "PISTOLE LVL 2", rarity: "rare" }),
    );
    expect(offers).toContainEqual(
      expect.objectContaining({ name: "UZI LVL 5", rarity: "epic" }),
    );
    expect(offers.map((offer) => getOfferKey(offer))).not.toContain(
      "weaponLevel:laser",
    );
    expect(offers).toContainEqual(
      expect.objectContaining({ kind: "newWeapon", name: "GRANATE (NEU)" }),
    );
  });

  it("stops drafting when the pool runs dry", (): void => {
    expect(
      draftOffers(
        createTestState(),
        { picked: [], pool: [] },
        createSeededRandom(SEED),
      ),
    ).toEqual([]);
  });
});
