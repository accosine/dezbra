import * as Phaser from "phaser";
import { createHudStatus, type HudStatus, updateHudStatus } from "./hud-status";
import { createHudTop, type HudTop, updateHudTop } from "./hud-top";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import { computeCameraScroll } from "../sim/camera";
import type { GameEvent } from "../sim/step-result";
import { getStreakMessage } from "../ui/streak-message";
import { Joystick } from "../ui/joystick";
import { MinimapView } from "../render/minimap-view";
import { PlayScene } from "./play-scene";
import { readSave } from "./game-registry";
import { SCENE_KEYS } from "./scene-keys";
import { showBanner } from "../ui/banner";
import { WeaponBar } from "./hud-weapons";

const STREAK_OFFSET = -60;
const VIEW = { height: GAME_HEIGHT, width: GAME_WIDTH };

type HudWidgets = Readonly<{
  joystick: Joystick;
  minimap: MinimapView;
  status: HudStatus;
  top: HudTop;
  weapons: WeaponBar;
}>;

/** Overlay with stats, bars, minimap, weapon bar, joystick and announcements. */
export class HudScene extends Phaser.Scene {
  private widgets: HudWidgets | null = null;

  public constructor() {
    super(SCENE_KEYS.hud);
  }

  private findPlay(): PlayScene | null {
    const play = this.scene.get(SCENE_KEYS.play);

    return play instanceof PlayScene ? play : null;
  }

  private announce(event: GameEvent): void {
    if (event.kind === "banner") {
      showBanner(this, event.text, { color: event.color });
    } else if (event.kind === "streak") {
      const message = getStreakMessage(event.combo);

      showBanner(this, message.text, {
        color: message.color,
        offsetY: STREAK_OFFSET,
      });
    }
  }

  public create(): void {
    const play = this.findPlay();
    const state = play?.snapshot ?? null;

    if (play === null || state === null) {
      return;
    }

    this.widgets = {
      joystick: new Joystick(this, (movement): void => {
        play.setJoystick(movement);
      }),
      minimap: new MinimapView(this, state),
      status: createHudStatus(this),
      top: createHudTop(this),
      weapons: new WeaponBar(this),
    };
    play.onRunEvent((event): void => {
      this.announce(event);
    });
  }

  public update(): void {
    const state = this.findPlay()?.snapshot ?? null;

    if (this.widgets === null || state === null) {
      return;
    }

    updateHudTop(this.widgets.top, state, readSave(this.registry).bestScore);
    updateHudStatus(this.widgets.status, state);
    this.widgets.weapons.update(state.weapons);
    this.widgets.minimap.update(state, {
      ...VIEW,
      ...computeCameraScroll(state.player, state.map.worldSize, VIEW),
    });
  }
}
