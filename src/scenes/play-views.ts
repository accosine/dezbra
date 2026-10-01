import type * as Phaser from "phaser";
import {
  createWorldView,
  updateWorldView,
  type WorldView,
} from "../render/world-view";
import {
  drawBullets,
  drawChests,
  drawGems,
  drawParticles,
} from "../render/effects-renderer";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import { BossView } from "../render/boss-view";
import { DEPTHS } from "../render/depths";
import { EnemyView } from "../render/enemy-view";
import { FloatTextView } from "../render/float-text-view";
import type { GameState } from "../sim/game-state";
import { PlayerView } from "../render/player-view";
import type { Rect } from "../utils/collision";
import { ScreenEffects } from "../render/screen-effects";

/** All Phaser views of a running game. */
export type PlayViews = Readonly<{
  boss: BossView;
  bullets: Phaser.GameObjects.Graphics;
  enemies: EnemyView;
  floats: FloatTextView;
  particles: Phaser.GameObjects.Graphics;
  pickups: Phaser.GameObjects.Graphics;
  player: PlayerView;
  screen: ScreenEffects;
  world: WorldView;
}>;

/** Creates every view for the state's world and entities. */
export const createPlayViews = (
  scene: Phaser.Scene,
  state: GameState,
): PlayViews => ({
  boss: new BossView(scene),
  bullets: scene.add.graphics().setDepth(DEPTHS.bullets),
  enemies: new EnemyView(scene),
  floats: new FloatTextView(scene),
  particles: scene.add.graphics().setDepth(DEPTHS.particles),
  pickups: scene.add.graphics().setDepth(DEPTHS.pickups),
  player: new PlayerView(scene, state),
  screen: new ScreenEffects(scene, { height: GAME_HEIGHT, width: GAME_WIDTH }),
  world: createWorldView(scene, state.world, state.map),
});

const redrawEffects = (views: PlayViews, state: GameState): void => {
  views.pickups.clear();
  drawGems(views.pickups, state.gems);
  drawChests(views.pickups, state.chests);
  views.bullets.clear();
  drawBullets(views.bullets, state.bullets);
  views.particles.clear();
  drawParticles(views.particles, state.particles);
};

/** Draws the state; `visible` is the world rectangle the camera shows. */
export const renderPlayViews = (
  views: PlayViews,
  state: GameState,
  visible: Rect,
): void => {
  updateWorldView(views.world, { frame: state.progress.frame, visible });
  views.enemies.update(state);
  views.boss.update(state);
  views.player.update(state);
  redrawEffects(views, state);
  views.floats.update(state.floats);
  views.screen.update(state);
};
