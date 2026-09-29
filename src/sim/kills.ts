import { addParticles, createBloodParticles } from "./particles";
import {
  createBanner,
  type GameEvent,
  type StepResult,
  withEvents,
} from "./step-result";
import type { Enemy, EnemyId, FloatingText, Gem } from "./entities";
import { KILL_TUNING, RUN_TUNING } from "./tuning";
import { NONE, STEP } from "../utils/numbers";
import { type Random, randomCentered } from "../utils/random";
import type { BossDefinition } from "../data/bosses";
import type { GameState } from "./game-state";

const GOLD = "#ffd700";
const COMBO_COLORS = { hot: "#ff6b6b", plain: "#f1c40f", warm: "#f39c12" };
const COMBO_THRESHOLDS = { big: 3, hot: 4, warm: 2 };

const pickComboColor = (multiplier: number): string => {
  if (multiplier > COMBO_THRESHOLDS.hot) {
    return COMBO_COLORS.hot;
  }

  return COMBO_COLORS[multiplier > COMBO_THRESHOLDS.warm ? "warm" : "plain"];
};

const createKillFloat = (
  enemy: Enemy,
  points: number,
  multiplier: number,
): FloatingText => ({
  color: pickComboColor(multiplier),
  isBig: multiplier > COMBO_THRESHOLDS.big,
  life: KILL_TUNING.floatLife,
  text: multiplier > STEP ? `×${multiplier} ${points}` : `+${points}`,
  x: enemy.x,
  y: enemy.y - KILL_TUNING.floatRise,
});

const createGem = (state: GameState, enemy: Enemy, random: Random): Gem => {
  const velocityX = randomCentered(random, KILL_TUNING.gemSpeed);
  const velocityY = randomCentered(random, KILL_TUNING.gemSpeed);
  const baseValue = KILL_TUNING[enemy.isBig ? "bigGemValue" : "gemBaseValue"];

  return {
    life: KILL_TUNING.gemLife,
    value:
      baseValue + Math.floor(state.progress.wave / KILL_TUNING.gemWaveDivisor),
    velocity: { x: velocityX, y: velocityY },
    x: enemy.x,
    y: enemy.y,
  };
};

const createKillBlood = (
  enemy: Enemy,
  random: Random,
): GameState["particles"] => [
  ...createBloodParticles(
    enemy,
    KILL_TUNING[enemy.isBig ? "bigBlood" : "blood"],
    random,
  ),
  ...(enemy.isBig
    ? createBloodParticles(enemy, KILL_TUNING.bigExtraBlood, random)
    : []),
];

const isStreakMilestone = (combo: number, lastStreakShown: number): boolean =>
  combo >= RUN_TUNING.streakInterval &&
  combo % RUN_TUNING.streakInterval === NONE &&
  combo !== lastStreakShown;

const scoreKill = (state: GameState, enemy: Enemy): StepResult => {
  const { progress } = state;
  const combo = progress.combo + STEP;
  const multiplier = Math.min(combo, RUN_TUNING.maxComboMultiplier);
  const points =
    KILL_TUNING[enemy.isBig ? "bigPoints" : "points"] *
    progress.wave *
    multiplier;
  const isStreak = isStreakMilestone(combo, progress.lastStreakShown);
  const events: ReadonlyArray<GameEvent> = isStreak
    ? [{ combo, kind: "streak" }]
    : [];

  return withEvents(
    {
      ...state,
      floats: [...state.floats, createKillFloat(enemy, points, multiplier)],
      progress: {
        ...progress,
        bestCombo: Math.max(progress.bestCombo, combo),
        combo,
        comboTicks: RUN_TUNING.comboTicks,
        earnedCoins:
          progress.earnedCoins +
          Math.max(
            KILL_TUNING.minimumCoins,
            Math.floor(points / KILL_TUNING.coinDivisor),
          ),
        kills: progress.kills + STEP,
        lastStreakShown: isStreak ? combo : progress.lastStreakShown,
        score: progress.score + points,
      },
    },
    events,
  );
};

const killZombie = (
  state: GameState,
  enemy: Enemy,
  random: Random,
): StepResult => {
  const bloody = addParticles(state, createKillBlood(enemy, random));
  const scored = scoreKill(bloody, enemy);

  return withEvents(
    {
      ...scored.state,
      enemies: scored.state.enemies.filter(
        (candidate) => candidate.id !== enemy.id,
      ),
      gems: [...scored.state.gems, createGem(state, enemy, random)],
    },
    scored.events,
  );
};

const createBossBlood = (
  enemy: Enemy,
  random: Random,
): GameState["particles"] =>
  Array.from({ length: KILL_TUNING.bossBloodBursts }, () => {
    const x = enemy.x + randomCentered(random, KILL_TUNING.bossBloodSpread);
    const y = enemy.y + randomCentered(random, KILL_TUNING.bossBloodSpread);

    return createBloodParticles({ x, y }, KILL_TUNING.bossBloodCount, random);
  }).flat();

type DefeatedBoss = Readonly<{ definition: BossDefinition; enemy: Enemy }>;

const killBoss = (
  state: GameState,
  defeated: DefeatedBoss,
  random: Random,
): StepResult => {
  const { progress } = state;
  const { enemy } = defeated;
  const points =
    defeated.definition.health + progress.wave * KILL_TUNING.bossRewardPerWave;
  const bossFloat: FloatingText = {
    color: GOLD,
    isBig: false,
    life: KILL_TUNING.bossFloatLife,
    text: `⭐+${points}`,
    x: enemy.x,
    y: enemy.y - KILL_TUNING.bossFloatRise,
  };

  return withEvents(
    addParticles(
      {
        ...state,
        chests: [
          ...state.chests,
          { animationTicks: NONE, x: enemy.x, y: enemy.y },
        ],
        enemies: state.enemies.filter((candidate) => candidate.id !== enemy.id),
        floats: [...state.floats, bossFloat],
        progress: {
          ...progress,
          earnedCoins:
            progress.earnedCoins +
            Math.floor(points / KILL_TUNING.bossCoinDivisor),
          kills: progress.kills + STEP,
          score: progress.score + points,
        },
      },
      createBossBlood(enemy, random),
    ),
    [{ kind: "boss-defeated" }, createBanner("BOSS BESIEGT! 🎁", GOLD)],
  );
};

/** Removes a killed enemy and grants points, coins, combo, drops and effects. */
export const defeatEnemy = (
  state: GameState,
  enemyId: EnemyId,
  random: Random,
): StepResult => {
  const enemy = state.enemies.find((candidate) => candidate.id === enemyId);

  if (enemy === undefined) {
    return withEvents(state, []);
  }

  if (enemy.boss === null) {
    return killZombie(state, enemy, random);
  }

  return killBoss(state, { definition: enemy.boss.definition, enemy }, random);
};
