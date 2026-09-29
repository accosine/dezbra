import { deepFreeze } from "../utils/deep-freeze";

/** Simulation ticks per second; all durations below are in ticks. */
export const TICKS_PER_SECOND = 60;

/** Player movement, damage and passives. */
export const PLAYER_TUNING = deepFreeze({
  bossContactPadding: 4,
  contactPadding: 3,
  deathShake: 18,
  ghostInputThreshold: 0.5,
  ghostInvulnerableTicks: 3,
  hansDamageRatio: 0.65,
  invulnerableTicks: 35,
  maxHitShake: 12,
  radius: 13,
  regenerationInterval: 60,
  reviveHealthRatio: 0.32,
  reviveShake: 8,
  shakePerDamage: 0.5,
  shieldCooldownTicks: 900,
  shieldRingLife: 18,
  shieldRingSize: 65,
  soldierShieldPeriodSeconds: 60,
  walkFrameTicks: 8,
  walkThreshold: 0.1,
});

/** Run-wide timers: combo, shake, freezing, experience. */
export const RUN_TUNING = deepFreeze({
  comboTicks: 120,
  freezeTicks: 180,
  levelFlashTicks: 30,
  maxComboMultiplier: 8,
  shakeDecay: 0.72,
  shakeMinimum: 0.2,
  startXpToNextLevel: 30,
  streakInterval: 5,
  timeLockInterval: 1200,
  xpGrowth: 1.35,
});

/** Wave length, healing and enemy limits. */
export const WAVE_TUNING = deepFreeze({
  baseHeal: 15,
  maxEnemiesBase: 14,
  maxEnemiesCap: 80,
  maxEnemiesPerWave: 5,
  spawnIntervalBase: 55,
  spawnIntervalMinimum: 10,
  spawnIntervalPerWave: 4,
  waveTicks: 1800,
});

/** Zombie spawning and movement. */
export const ENEMY_TUNING = deepFreeze({
  bigChanceBase: 0.1,
  bigChancePerWave: 0.015,
  bigContactDamage: 25,
  bigHealthMultiplier: 10,
  bigRadius: 18,
  contactDamage: 12,
  fastChance: 0.2,
  fastSpeed: 2.1,
  healthBase: 4,
  healthPerWave: 1.8,
  normalSpeed: 0.85,
  radius: 9,
  spawnDistanceMinimum: 295,
  spawnDistanceRange: 135,
  spawnTicks: 10,
  speedJitter: 0.5,
  speedPerWave: 0.09,
  staggerOnHit: 10,
  variants: 3,
  walkFrameTicks: 12,
  worldMargin: 22,
});

/** Boss spawning and attacks. */
export const BOSS_TUNING = deepFreeze({
  approachMultiplier: 0.5,
  chargeEnd: 158,
  chargeMultiplier: 4,
  chargeStart: 110,
  coinDivisor: 5,
  enemyBulletSize: 5,
  gunColor: "#ff4444",
  gunCount: 3,
  gunDamage: 14,
  gunInterval: 78,
  gunLife: 82,
  gunSpeed: 7,
  gunSpread: 0.2,
  healthPerWave: 0.12,
  minionCount: 3,
  minionDistance: 58,
  minionHealth: 5,
  minionSpawnTicks: 6,
  minionSpeed: 1.25,
  minionSpread: 2,
  minionVariant: 1,
  poisonArea: 1.2,
  poisonColor: "#00cc44",
  poisonCount: 10,
  poisonDamage: 10,
  poisonInterval: 68,
  poisonLife: 88,
  poisonSpeed: 3.5,
  rewardPerWave: 120,
  spawnDistance: 340,
  spawnTicks: 120,
  summonInterval: 158,
  walkFrameTicks: 14,
  worldMargin: 45,
});

/** Rewards and feedback for kills. */
export const KILL_TUNING = deepFreeze({
  bigBlood: 20,
  bigExtraBlood: 10,
  bigGemValue: 8,
  bigPoints: 50,
  blood: 10,
  bossBloodBursts: 4,
  bossBloodCount: 20,
  bossBloodSpread: 36,
  bossFloatLife: 85,
  bossFloatRise: 34,
  coinDivisor: 10,
  floatLife: 55,
  floatRise: 20,
  gemBaseValue: 2,
  gemLife: 420,
  gemSpeed: 2.5,
  gemWaveDivisor: 2,
  minimumCoins: 1,
  points: 10,
});

/** Bullet hits and explosions. */
export const COMBAT_TUNING = deepFreeze({
  blackHolePull: 2.5,
  critMultiplier: 3,
  explosionBlood: 10,
  explosionOnHitRatio: 0.6,
  explosionRingLife: 14,
  hitBlood: 5,
  laserSparkLife: 12,
  laserSparkSize: 4,
  worldMargin: 100,
  zaraOrbStagger: 20,
});

/** Experience crystals and chests. */
export const PICKUP_TUNING = deepFreeze({
  chestRadius: 32,
  gemFriction: 0.93,
  gemPickupRadius: 15,
  magnetRadius: 88,
  maxPullSpeed: 11,
  pullFactor: 2,
});

/** Visual particles and floating texts. */
export const PARTICLE_TUNING = deepFreeze({
  bloodColors: ["#c0392b", "#922b21"],
  bloodLifeMinimum: 16,
  bloodLifeRange: 16,
  bloodMaxLife: 32,
  bloodSizeMinimum: 2,
  bloodSizeRange: 3.5,
  bloodSpeedMinimum: 1,
  bloodSpeedRange: 3.5,
  floatRise: 0.75,
  gravity: 0.09,
});

/** Weapon timing, scaling and bullet defaults. */
export const WEAPON_TUNING = deepFreeze({
  baseBulletSize: 4,
  blitzBonusPerLevel: 0.03,
  blitzMaxBonus: 0.5,
  defaultExplosionRadius: 40,
  fallbackRange: 200,
  levelDamageBonus: 0.2,
  minimumInterval: 4,
  muzzleLife: 8,
  muzzleRise: -1,
  muzzleSize: 5,
  muzzleSpeed: 2,
  napalmScatter: 500,
  orbitSpeed: 0.072,
});
