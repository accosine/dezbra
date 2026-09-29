import { type CharacterId, CHARACTERS } from "../data/characters";
import { type Enemy, type EnemyId, toEnemyId } from "./entities";
import { type MapId, MAPS } from "../data/maps";
import { createRun } from "./create-run";
import type { GameState } from "./game-state";
import type { Random } from "../utils/random";
import type { ShopItemId } from "../data/shop-items";
import { STEP } from "../utils/numbers";
import type { StepContext } from "./step-result";
import type { World } from "./world";
import { ZERO_VECTOR } from "../utils/vector";

const NEUTRAL_ROLL = 0.5;
const FIRST_ENEMY_ID = 1;

/** A world without buildings, decorations or stains. */
export const EMPTY_WORLD: World = {
  buildings: [],
  decorations: [],
  stains: [],
};

/** Options for {@link createTestState}. */
export type TestStateOptions = Readonly<{
  characterId?: CharacterId;
  mapId?: MapId;
  purchasedItems?: ReadonlyArray<ShopItemId>;
}>;

/** Creates a fresh run in an empty world so tests are not affected by buildings. */
export const createTestState = (options: TestStateOptions = {}): GameState => ({
  ...createRun({
    character: CHARACTERS[options.characterId ?? "soldier"],
    map: MAPS[options.mapId ?? "city"],
    purchasedItems: options.purchasedItems ?? [],
  }),
  world: EMPTY_WORLD,
});

/** Returns a random source that always yields the same value. */
export const fixedRandom =
  (value: number): Random =>
  (): number =>
    value;

/** Returns a random source that cycles through the given values. */
export const sequenceRandom = (values: ReadonlyArray<number>): Random => {
  let calls = 0;

  return (): number => {
    const value = values[calls % values.length] ?? NEUTRAL_ROLL;
    calls += STEP;

    return value;
  };
};

/** A tick context without movement. */
export const createTestContext = (
  random: Random = fixedRandom(NEUTRAL_ROLL),
): StepContext => ({
  movement: ZERO_VECTOR,
  random,
});

/** Creates a regular zombie next to the given position. */
export const createTestEnemy = (overrides: Partial<Enemy> = {}): Enemy => ({
  boss: null,
  contactDamage: 12,
  health: 10,
  id: toEnemyId(FIRST_ENEMY_ID),
  isBig: false,
  isFast: false,
  maxHealth: 10,
  radius: 9,
  spawnTicks: 0,
  speed: 1,
  staggerTicks: 0,
  variant: 0,
  walkFrame: 0,
  walkTicks: 0,
  x: 0,
  y: 0,
  ...overrides,
});

/** Returns the enemy with the given id or throws. */
export const requireEnemy = (state: GameState, enemyId: EnemyId): Enemy => {
  const enemy = state.enemies.find((candidate) => candidate.id === enemyId);

  if (enemy === undefined) {
    throw new Error(`Enemy ${enemyId} does not exist.`);
  }

  return enemy;
};
