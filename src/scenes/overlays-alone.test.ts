import { describe, expect, it } from "vitest";
import { describeOffer, UpgradeScene } from "./upgrade-scene";
import {
  readTexts,
  requireScene,
  startScene,
  useGame,
} from "../harness/phaser-harness";
import { ChestScene } from "./chest-scene";
import { GameOverScene } from "./game-over-scene";
import { HudScene } from "./hud-scene";
import { SCENE_KEYS } from "./scene-keys";

const getGame = useGame([HudScene, UpgradeScene, ChestScene, GameOverScene]);

describe("overlays without a running game", (): void => {
  it("stay empty and do not crash", async (): Promise<void> => {
    const game = getGame();

    await startScene(game, SCENE_KEYS.hud);
    await startScene(game, SCENE_KEYS.upgrade);
    await startScene(game, SCENE_KEYS.chest);
    await startScene(game, SCENE_KEYS.gameOver);
    requireScene(game, SCENE_KEYS.hud, HudScene).update();

    expect(
      readTexts(requireScene(game, SCENE_KEYS.upgrade, UpgradeScene)),
    ).toEqual([]);
    expect(readTexts(requireScene(game, SCENE_KEYS.chest, ChestScene))).toEqual(
      [],
    );
    expect(
      readTexts(requireScene(game, SCENE_KEYS.gameOver, GameOverScene)),
    ).toEqual(expect.arrayContaining(["DU BIST TOT", "↺ NOCHMAL"]));
  });

  it("describes a fusion offer without a recipe", (): void => {
    expect(
      describeOffer({
        description: "",
        icon: "🔴",
        kind: "fusion",
        name: "LASER",
        rarity: "fusion",
        weaponId: "laser",
      }).hint,
    ).toBe("⚗ ");
  });
});
