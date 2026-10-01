import * as Phaser from "phaser";
import { applyLoot, createLootOffers } from "../sim/loot";
import {
  createMovementKeys,
  type MovementKeys,
  readHeldKeys,
} from "./play-input";
import { createPlayViews, type PlayViews, renderPlayViews } from "./play-views";
import { createUpgradeOffers, type UpgradeOffer } from "../sim/upgrade-offers";
import { finalizeRun, type RunReport } from "./run-report";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import type { GameEvent, StepResult } from "../sim/step-result";
import type { LootDefinition, LootId } from "../data/loot";
import { type Random, randomCentered } from "../utils/random";
import { readSelection, recordUnlocks, updateSave } from "./game-registry";
import { recordBossKill, recordFusion, recordRunStart } from "../save/progress";
import { type Vector, ZERO_VECTOR } from "../utils/vector";
import { applyUpgrade } from "../sim/apply-upgrade";
import { CHARACTERS } from "../data/characters";
import { combineMovementInput } from "../sim/player-movement";
import { computeCameraScroll } from "../sim/camera";
import { createRun } from "../sim/create-run";
import { describeUnlock } from "./unlock-banners";
import type { GameState } from "../sim/game-state";
import { MAPS } from "../data/maps";
import { SCENE_KEYS } from "./scene-keys";
import { stepGame } from "../sim/step";
import { TICKS_PER_SECOND } from "../sim/tuning";

const MILLISECONDS_PER_SECOND = 1000;
const TICK_MILLISECONDS = MILLISECONDS_PER_SECOND / TICKS_PER_SECOND;
const PLAY = { maxDelta: 250, maxTicks: 5, shakeFactor: 2 };
const RUN_EVENT = "run-event";
const VIEW_SIZE = { height: GAME_HEIGHT, width: GAME_WIDTH };
const NONE = 0;
const FIRST_LEVEL = 1;
const NO_KEYS: MovementKeys = { down: [], left: [], right: [], up: [] };

const PROGRESS_EVENTS: Readonly<
  Partial<Record<GameEvent["kind"], typeof recordFusion>>
> = {
  "boss-defeated": recordBossKill,
  "fusion-built": recordFusion,
};

/** The running game: fixed 60 Hz simulation, rendering, overlays and progress. */
export class PlayScene extends Phaser.Scene {
  private accumulator = NONE;

  private joystick: Vector = ZERO_VECTOR;

  private keys: MovementKeys = NO_KEYS;

  private lootChoices: ReadonlyArray<LootDefinition> = [];

  private readonly random: Random = Math.random;

  private report: RunReport | null = null;

  private state: GameState | null = null;

  private upgradeChoices: ReadonlyArray<UpgradeOffer> = [];

  private views: PlayViews | null = null;

  public constructor() {
    super(SCENE_KEYS.play);
  }

  private advance(state: GameState, delta: number): StepResult {
    this.accumulator += Math.min(delta, PLAY.maxDelta);

    const ticks = Math.min(
      PLAY.maxTicks,
      Math.floor(this.accumulator / TICK_MILLISECONDS),
    );
    const movement = combineMovementInput(
      this.joystick,
      readHeldKeys(this.keys),
    );

    this.accumulator -= ticks * TICK_MILLISECONDS;

    return Array.from({ length: ticks }).reduce<StepResult>(
      (result) => {
        const next = stepGame(result.state, { movement, random: this.random });

        return {
          events: [...result.events, ...next.events],
          state: next.state,
        };
      },
      { events: [], state },
    );
  }

  private apply(result: StepResult): void {
    this.state = result.state;

    for (const event of result.events) {
      this.recordProgress(event);
      this.events.emit(RUN_EVENT, event);
    }

    this.followPhase(result.state);
  }

  private finish(state: GameState): void {
    this.report = finalizeRun(this.registry, state);
    this.scene.stop(SCENE_KEYS.hud);
    this.scene.stop(SCENE_KEYS.upgrade);
    this.scene.stop(SCENE_KEYS.chest);
    this.scene.start(SCENE_KEYS.gameOver);
  }

  private followPhase(state: GameState): void {
    switch (state.phase) {
      case "dead": {
        this.finish(state);

        break;
      }
      case "upgrade": {
        this.offerUpgrades(state);

        break;
      }
      case "chest": {
        this.offerLoot();

        break;
      }
      // No default
    }
  }

  private offerLoot(): void {
    this.lootChoices = createLootOffers(this.random);

    this.launchOverlay(SCENE_KEYS.chest);
  }

  private offerUpgrades(state: GameState): void {
    this.upgradeChoices = createUpgradeOffers(state, this.random);

    this.launchOverlay(SCENE_KEYS.upgrade);
  }

  private launchOverlay(key: string): void {
    if (!this.scene.isActive(key)) {
      this.scene.launch(key);
    }
  }

  private recordProgress(event: GameEvent): void {
    const record = PROGRESS_EVENTS[event.kind];

    if (record !== undefined) {
      updateSave(this.registry, record);

      for (const unlock of recordUnlocks(this.registry)) {
        this.events.emit(RUN_EVENT, {
          ...describeUnlock(unlock),
          kind: "banner",
        });
      }
    }
  }

  private reset(state: GameState): void {
    this.accumulator = NONE;
    this.joystick = ZERO_VECTOR;
    this.report = null;
    this.state = state;
    this.upgradeChoices = [];
    this.lootChoices = [];
    this.events.removeAllListeners(RUN_EVENT);
  }

  private render(state: GameState): void {
    const scroll = computeCameraScroll(
      state.player,
      state.map.worldSize,
      VIEW_SIZE,
    );
    const shake = state.progress.shakeMagnitude * PLAY.shakeFactor;

    this.cameras.main.setScroll(
      scroll.x + randomCentered(this.random, shake),
      scroll.y + randomCentered(this.random, shake),
    );

    if (this.views !== null) {
      renderPlayViews(this.views, state, { ...VIEW_SIZE, ...scroll });
    }
  }

  /** Current state of the run (null before the run started). */
  public get snapshot(): GameState | null {
    return this.state;
  }

  /** Current level of the player (1 before the run started). */
  public get level(): number {
    return this.state?.progress.level ?? FIRST_LEVEL;
  }

  /** Offers of the pending level-up. */
  public get pendingUpgrades(): ReadonlyArray<UpgradeOffer> {
    return this.state?.phase === "upgrade" ? this.upgradeChoices : [];
  }

  /** Rewards of the pending chest. */
  public get pendingLoot(): ReadonlyArray<LootDefinition> {
    return this.state?.phase === "chest" ? this.lootChoices : [];
  }

  /** Result of the last finished run. */
  public get runReport(): RunReport | null {
    return this.report;
  }

  /** Applies the chosen chest reward. */
  public chooseLoot(lootId: LootId): void {
    if (this.state?.phase !== "chest") {
      return;
    }

    this.scene.stop(SCENE_KEYS.chest);
    this.apply(applyLoot(this.state, lootId));
  }

  /** Applies the chosen level-up offer. */
  public chooseUpgrade(offer: UpgradeOffer): void {
    if (this.state?.phase !== "upgrade") {
      return;
    }

    this.scene.stop(SCENE_KEYS.upgrade);
    this.apply(applyUpgrade(this.state, offer));
  }

  /** Subscribes to banners, streaks, boss and level events of the run. */
  public onRunEvent(listener: (event: GameEvent) => void): void {
    this.events.on(RUN_EVENT, listener);
  }

  /** Replaces the running state (same world) and follows its phase, e.g. to resume a snapshot. */
  public restoreState(state: GameState): void {
    this.apply({ events: [], state });
  }

  /** Sets the joystick movement (each axis in [-1, 1]). */
  public setJoystick(movement: Vector): void {
    this.joystick = movement;
  }

  public create(): void {
    const selection = readSelection(this.registry);
    const save = updateSave(this.registry, recordRunStart);
    const state = createRun({
      character: CHARACTERS[selection.characterId],
      map: MAPS[selection.mapId],
      purchasedItems: save.purchasedItems,
    });

    this.reset(state);
    this.keys = createMovementKeys(this);
    this.views = createPlayViews(this, state);
    this.render(state);
    this.scene.launch(SCENE_KEYS.hud);
  }

  public update(_time: number, delta: number): void {
    if (this.state?.phase === "playing") {
      this.apply(this.advance(this.state, delta));
    }

    if (this.state !== null && this.report === null) {
      this.render(this.state);
    }
  }
}
