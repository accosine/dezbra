import { describe, expect, it } from "vitest";
import type { PerkId, Rarity } from "../data/perks";
import { applyUpgrade } from "./apply-upgrade";
import { createTestState } from "./sim-fixtures";
import type { GameState } from "./game-state";
import { RUN_TUNING } from "./tuning";
import type { UpgradeOffer } from "./upgrade-offers";

const SINGLE = 1;
const PENDING = 2;
const CARD: Readonly<{
  description: string;
  icon: string;
  name: string;
  rarity: Rarity;
}> = {
  description: "",
  icon: "",
  name: "",
  rarity: "rare",
};

const pendingState = (pendingLevelUps = SINGLE): GameState => {
  const state = createTestState();

  return {
    ...state,
    phase: "upgrade",
    progress: { ...state.progress, pendingLevelUps },
  };
};

const perk = (perkId: PerkId): UpgradeOffer => ({
  ...CARD,
  kind: "perk",
  perkId,
});

describe("applyUpgrade weapons", (): void => {
  it("adds, levels and fuses weapons", (): void => {
    const withUzi = applyUpgrade(pendingState(), {
      ...CARD,
      kind: "newWeapon",
      weaponId: "uzi",
    }).state;
    const leveled = applyUpgrade(withUzi, {
      ...CARD,
      kind: "weaponLevel",
      weaponId: "uzi",
    }).state;
    const withShotgun = applyUpgrade(leveled, {
      ...CARD,
      kind: "newWeapon",
      weaponId: "shotgun",
    }).state;
    const fused = applyUpgrade(withShotgun, {
      ...CARD,
      kind: "fusion",
      weaponId: "hellfire",
    });

    expect(leveled.weapons.find((weapon) => weapon.id === "uzi")?.level).toBe(
      PENDING,
    );
    expect(fused.state.weapons.map((weapon) => weapon.id)).toEqual([
      "pistol",
      "hellfire",
    ]);
    expect(fused.events.map((event) => event.kind)).toEqual([
      "fusion-built",
      "banner",
    ]);
  });

  it("treats a base weapon offered as fusion as a plain addition", (): void => {
    const { state } = applyUpgrade(pendingState(), {
      ...CARD,
      kind: "fusion",
      weaponId: "laser",
    });

    expect(state.weapons.map((weapon) => weapon.id)).toEqual([
      "pistol",
      "laser",
    ]);
  });
});

describe("applyUpgrade phase", (): void => {
  it("returns to play or asks for the next pending choice", (): void => {
    expect(applyUpgrade(pendingState(), perk("speed")).state.phase).toBe(
      "playing",
    );
    const next = applyUpgrade(pendingState(PENDING), perk("speed")).state;

    expect(next.phase).toBe("upgrade");
    expect(next.progress.pendingLevelUps).toBe(SINGLE);
  });
});

const PERK_EFFECTS: ReadonlyArray<
  Readonly<{ expected: Partial<GameState["stats"]>; perkId: PerkId }>
> = [
  { expected: { area: 1.4 }, perkId: "area" },
  { expected: { cooldownMultiplier: 0.78 }, perkId: "cooldown" },
  { expected: { critChance: 0.15 }, perkId: "crit" },
  { expected: { damageMultiplier: 1.25 }, perkId: "damage" },
  { expected: { hasExplosiveRounds: true }, perkId: "explosive" },
  { expected: { health: 120, maxHealth: 120 }, perkId: "health" },
  { expected: { magnetMultiplier: 2 }, perkId: "magnet" },
  { expected: { extraProjectiles: 1 }, perkId: "multifire" },
  { expected: { hasPierce: true }, perkId: "pierce" },
  { expected: { regeneration: 3 }, perkId: "regeneration" },
  { expected: { hasRevive: true }, perkId: "revive" },
  { expected: { hasShield: true }, perkId: "shield" },
  { expected: { vampirism: 0.03 }, perkId: "vampire" },
  { expected: { xpMultiplier: 1.35 }, perkId: "xpBoost" },
  { expected: { hasTimeLock: true }, perkId: "timelock" },
];
const SOLDIER_SPEED = { boosted: 3.172 };
const CAPS = { cooldown: 0.2, crit: 0.55, highCrit: 0.5, lowCooldown: 0.21 };

describe("applyUpgrade perks", (): void => {
  it.each(PERK_EFFECTS)("applies $perkId", ({ expected, perkId }): void => {
    expect(
      applyUpgrade(pendingState(), perk(perkId)).state.stats,
    ).toMatchObject(expected);
  });

  it("speeds up the player and arms the time lock", (): void => {
    expect(
      applyUpgrade(pendingState(), perk("speed")).state.stats.speed,
    ).toBeCloseTo(SOLDIER_SPEED.boosted);
    expect(
      applyUpgrade(pendingState(), perk("timelock")).state.progress
        .timeLockTicks,
    ).toBe(RUN_TUNING.timeLockInterval);
  });

  it("caps fire rate and crit chance", (): void => {
    const state = pendingState();
    const capped = {
      ...state,
      stats: {
        ...state.stats,
        cooldownMultiplier: CAPS.lowCooldown,
        critChance: CAPS.highCrit,
      },
    };

    expect(
      applyUpgrade(capped, perk("cooldown")).state.stats.cooldownMultiplier,
    ).toBe(CAPS.cooldown);
    expect(applyUpgrade(capped, perk("crit")).state.stats.critChance).toBe(
      CAPS.crit,
    );
  });
});
