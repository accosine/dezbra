import * as Phaser from "phaser";
import { type Vector, ZERO_VECTOR } from "../utils/vector";
import { hexToNumber } from "../utils/color";
import { readJoystick } from "../utils/joystick-math";

/** Position and size of the virtual joystick (bottom left, like the original). */
export const JOYSTICK_LAYOUT = {
  baseAlpha: 0.02,
  baseRadius: 57,
  baseStrokeAlpha: 0.08,
  center: 0,
  depth: 50,
  knobAlpha: 0.12,
  knobRadius: 22,
  knobStrokeAlpha: 0.18,
  range: 44,
  strokeWidth: 3,
  x: 69,
  y: 753,
};

const WHITE = hexToNumber("#ffffff");
const NO_POINTER = -1;

const createDisc = (
  scene: Phaser.Scene,
  radius: number,
  alphas: Readonly<{ fill: number; stroke: number }>,
): Phaser.GameObjects.Arc =>
  scene.add
    .circle(
      JOYSTICK_LAYOUT.center,
      JOYSTICK_LAYOUT.center,
      radius,
      WHITE,
      alphas.fill,
    )
    .setStrokeStyle(JOYSTICK_LAYOUT.strokeWidth, WHITE, alphas.stroke);

/** Touch/mouse joystick that reports movement in [-1, 1] per axis. */
export class Joystick extends Phaser.GameObjects.Container {
  private activePointer = NO_POINTER;

  private readonly knob: Phaser.GameObjects.Arc;

  private readonly onChange: (movement: Vector) => void;

  public constructor(
    scene: Phaser.Scene,
    onChange: (movement: Vector) => void,
  ) {
    super(scene, JOYSTICK_LAYOUT.x, JOYSTICK_LAYOUT.y);
    this.onChange = onChange;
    this.knob = createDisc(scene, JOYSTICK_LAYOUT.knobRadius, {
      fill: JOYSTICK_LAYOUT.knobAlpha,
      stroke: JOYSTICK_LAYOUT.knobStrokeAlpha,
    });

    const base = createDisc(scene, JOYSTICK_LAYOUT.baseRadius, {
      fill: JOYSTICK_LAYOUT.baseAlpha,
      stroke: JOYSTICK_LAYOUT.baseStrokeAlpha,
    })
      .setInteractive()
      .on(
        Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
        (pointer: Phaser.Input.Pointer) => {
          this.activePointer = pointer.id;
          this.follow(pointer);
        },
      );

    this.add([base, this.knob]).setDepth(JOYSTICK_LAYOUT.depth);
    scene.add.existing(this);
    scene.input.on(
      Phaser.Input.Events.POINTER_MOVE,
      (pointer: Phaser.Input.Pointer) => {
        this.moveWith(pointer);
      },
    );
    scene.input.on(
      Phaser.Input.Events.POINTER_UP,
      (pointer: Phaser.Input.Pointer) => {
        this.release(pointer);
      },
    );
  }

  private follow(pointer: Phaser.Input.Pointer): void {
    const reading = readJoystick(
      { x: pointer.x - this.x, y: pointer.y - this.y },
      JOYSTICK_LAYOUT.range,
    );

    this.knob.setPosition(reading.knob.x, reading.knob.y);
    this.onChange(reading.movement);
  }

  private moveWith(pointer: Phaser.Input.Pointer): void {
    if (pointer.id === this.activePointer) {
      this.follow(pointer);
    }
  }

  private release(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.activePointer) {
      return;
    }

    this.activePointer = NO_POINTER;
    this.knob.setPosition(JOYSTICK_LAYOUT.center, JOYSTICK_LAYOUT.center);
    this.onChange(ZERO_VECTOR);
  }
}
