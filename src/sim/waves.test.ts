import { createTestContext, createTestState } from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import type { GameState } from "./game-state";
import { updateWave } from "./waves";
import { WAVE_TUNING } from "./tuning";

const NONE = 0;
const SINGLE = 1;
const HURT_HEALTH = 50;
const WAVE_BEFORE_BOSS = 2;
const CEMETERY_HEAL_BONUS = 10;

const nearWaveEnd = (state: GameState, wave: number): GameState => ({
  ...state,
  progress: {
    ...state.progress,
    wave,
    waveTicks: WAVE_TUNING.waveTicks - SINGLE,
  },
  stats: { ...state.stats, health: HURT_HEALTH },
});

describe("updateWave", (): void => {
  it("counts the wave timer", (): void => {
    const { events, state } = updateWave(
      createTestState(),
      createTestContext(),
    );

    expect(events).toEqual([]);
    expect(state.progress.waveTicks).toBe(SINGLE);
  });

  it("starts the next wave with healing and an announcement", (): void => {
    const { events, state } = updateWave(
      nearWaveEnd(createTestState(), SINGLE),
      createTestContext(),
    );

    expect(state.progress).toMatchObject({ wave: 2, waveTicks: NONE });
    expect(state.stats.health).toBe(HURT_HEALTH + WAVE_TUNING.baseHeal);
    expect(events).toEqual([
      { color: "#2ecc71", kind: "banner", text: "WELLE 2  (24 FEINDE)" },
    ]);
  });

  it("heals more on harsh maps and warns before a boss", (): void => {
    const cemetery = nearWaveEnd(
      createTestState({ mapId: "cemetery" }),
      WAVE_BEFORE_BOSS,
    );
    const { events, state } = updateWave(cemetery, createTestContext());

    expect(state.stats.health).toBe(
      HURT_HEALTH + WAVE_TUNING.baseHeal + CEMETERY_HEAL_BONUS,
    );
    expect(events.map((event) => event.kind)).toEqual([
      "banner",
      "boss-spawned",
      "banner",
    ]);
    expect(events.at(NONE)).toMatchObject({ text: "⚠️ WELLE 3 — BOSS KOMMT!" });
  });
});
