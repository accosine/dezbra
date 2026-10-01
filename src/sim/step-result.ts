import type { BossDefinition } from "../data/bosses";
import type { GameState } from "./game-state";
import type { Random } from "../utils/random";
import type { Vector } from "../utils/vector";

/** Something the presentation layer should react to. */
export type GameEvent =
  | Readonly<{ boss: BossDefinition; kind: "boss-spawned" }>
  | Readonly<{ color: string; kind: "banner"; text: string }>
  | Readonly<{ combo: number; kind: "streak" }>
  | Readonly<{ kind: "boss-defeated" }>
  | Readonly<{ kind: "chest-found" }>
  | Readonly<{ kind: "fusion-built" }>
  | Readonly<{ kind: "level-up" }>
  | Readonly<{ kind: "player-died" }>;

/** The new state plus the events that happened while producing it. */
export type StepResult = Readonly<{
  events: ReadonlyArray<GameEvent>;
  state: GameState;
}>;

/** Per-tick input: normalized-or-zero movement and the random source. */
export type StepContext = Readonly<{ movement: Vector; random: Random }>;

/** A simulation stage. */
export type Stage = (state: GameState, context: StepContext) => StepResult;

/** Wraps a state without events. */
export const withoutEvents = (state: GameState): StepResult => ({
  events: [],
  state,
});

/** Wraps a state with the given events. */
export const withEvents = (
  state: GameState,
  events: ReadonlyArray<GameEvent>,
): StepResult => ({ events, state });

/** Runs a follow-up on the state of a result and keeps the events of both. */
export const andThen = (
  result: StepResult,
  next: (state: GameState) => StepResult,
): StepResult => {
  const followUp = next(result.state);

  return {
    events: [...result.events, ...followUp.events],
    state: followUp.state,
  };
};

/** Runs the stages in order, threading state and collecting events. */
export const runStages = (
  initial: GameState,
  stages: ReadonlyArray<Stage>,
  context: StepContext,
): StepResult =>
  stages.reduce<StepResult>(
    (result, stage) => andThen(result, (state) => stage(state, context)),
    withoutEvents(initial),
  );

/** Creates a banner event. */
export const createBanner = (text: string, color: string): GameEvent => ({
  color,
  kind: "banner",
  text,
});
