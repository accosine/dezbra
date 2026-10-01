import { angleBetween, distanceBetween } from "../utils/math";
import { type GameEvent, type StepResult, withEvents } from "./step-result";
import type { GameState, RunProgress } from "./game-state";
import { NONE, STEP } from "../utils/numbers";
import { PICKUP_TUNING, RUN_TUNING } from "./tuning";
import type { Gem } from "./entities";

type Leveling = Readonly<{ levelUps: number; progress: RunProgress }>;

const levelUp = (leveling: Leveling): Leveling => {
  const { progress } = leveling;

  if (progress.xp < progress.xpToNextLevel) {
    return leveling;
  }

  return levelUp({
    levelUps: leveling.levelUps + STEP,
    progress: {
      ...progress,
      level: progress.level + STEP,
      levelFlashTicks: RUN_TUNING.levelFlashTicks,
      pendingLevelUps: progress.pendingLevelUps + STEP,
      xp: progress.xp - progress.xpToNextLevel,
      xpToNextLevel: Math.round(progress.xpToNextLevel * RUN_TUNING.xpGrowth),
    },
  });
};

/** Adds experience (scaled by the XP multiplier) and queues one upgrade per level gained. */
export const gainExperience = (
  state: GameState,
  amount: number,
): StepResult => {
  const leveled = levelUp({
    levelUps: NONE,
    progress: {
      ...state.progress,
      xp: state.progress.xp + amount * state.stats.xpMultiplier,
    },
  });
  const events = Array.from({ length: leveled.levelUps }, (): GameEvent => ({
    kind: "level-up",
  }));

  return withEvents({ ...state, progress: leveled.progress }, events);
};

const moveGem = (gem: Gem, state: GameState): Gem => {
  const drifted = {
    ...gem,
    life: gem.life - STEP,
    velocity: {
      x: gem.velocity.x * PICKUP_TUNING.gemFriction,
      y: gem.velocity.y * PICKUP_TUNING.gemFriction,
    },
    x: gem.x + gem.velocity.x,
    y: gem.y + gem.velocity.y,
  };
  const magnetRadius =
    PICKUP_TUNING.magnetRadius * state.stats.magnetMultiplier;
  const distance = distanceBetween(drifted, state.player);

  if (distance >= magnetRadius) {
    return drifted;
  }

  const angle = angleBetween(drifted, state.player);
  const pull = Math.min(
    PICKUP_TUNING.maxPullSpeed,
    (magnetRadius / distance) * PICKUP_TUNING.pullFactor,
  );

  return {
    ...drifted,
    x: drifted.x + Math.cos(angle) * pull,
    y: drifted.y + Math.sin(angle) * pull,
  };
};

const isCollected = (gem: Gem, state: GameState): boolean =>
  distanceBetween(
    { x: gem.x + gem.velocity.x, y: gem.y + gem.velocity.y },
    state.player,
  ) < PICKUP_TUNING.gemPickupRadius;

/** Moves and attracts gems; collected gems grant experience, old ones vanish. */
export const updateGems = (state: GameState): StepResult => {
  const collected = state.gems.filter((gem) => isCollected(gem, state));
  const remaining = state.gems
    .filter((gem) => !isCollected(gem, state))
    .map((gem) => moveGem(gem, state))
    .filter((gem) => gem.life > NONE);
  const amount = collected.reduce(
    (sum, gem) => sum + gem.value * state.map.xpMultiplier,
    NONE,
  );

  return gainExperience({ ...state, gems: remaining }, amount);
};
