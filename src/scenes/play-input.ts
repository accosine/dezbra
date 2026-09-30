import * as Phaser from "phaser";
import type { HeldKeys } from "../sim/player-movement";

/** Arrow keys and WASD, grouped by direction. */
export type MovementKeys = Readonly<
  Record<keyof HeldKeys, ReadonlyArray<Phaser.Input.Keyboard.Key>>
>;

const { KeyCodes } = Phaser.Input.Keyboard;

/** Registers arrow keys and WASD for movement (none without a keyboard). */
export const createMovementKeys = (scene: Phaser.Scene): MovementKeys => {
  const { keyboard } = scene.input;
  const bind = (
    codes: ReadonlyArray<number>,
  ): ReadonlyArray<Phaser.Input.Keyboard.Key> =>
    keyboard instanceof Phaser.Input.Keyboard.KeyboardPlugin
      ? codes.map((code) => keyboard.addKey(code))
      : [];

  return {
    down: bind([KeyCodes.DOWN, KeyCodes.S]),
    left: bind([KeyCodes.LEFT, KeyCodes.A]),
    right: bind([KeyCodes.RIGHT, KeyCodes.D]),
    up: bind([KeyCodes.UP, KeyCodes.W]),
  };
};

const isAnyDown = (keys: ReadonlyArray<Phaser.Input.Keyboard.Key>): boolean =>
  keys.some((key) => key.isDown);

/** Reads which movement directions are held. */
export const readHeldKeys = (keys: MovementKeys): HeldKeys => ({
  down: isAnyDown(keys.down),
  left: isAnyDown(keys.left),
  right: isAnyDown(keys.right),
  up: isAnyDown(keys.up),
});
