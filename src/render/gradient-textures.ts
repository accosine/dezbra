import type * as Phaser from "phaser";
import { TEXTURE_KEYS } from "./texture-keys";

/** A vertical gradient: color stops from top (0) to bottom (1) of the texture. */
export type VerticalGradient = Readonly<{
  key: string;
  stops: ReadonlyArray<Readonly<{ color: string; offset: number }>>;
}>;

/** Screen overlays of the cemetery (bottom mist) and wasteland (sun glare). */
export const OVERLAY_GRADIENTS: ReadonlyArray<VerticalGradient> = [
  {
    key: TEXTURE_KEYS.mist,
    stops: [
      { color: "rgba(4,4,22,0)", offset: 0 },
      { color: "rgba(4,4,22,0)", offset: 0.5 },
      { color: "rgba(4,4,22,0.45)", offset: 1 },
    ],
  },
  {
    key: TEXTURE_KEYS.glare,
    stops: [
      { color: "rgba(20,12,2,0.1)", offset: 0 },
      { color: "rgba(20,12,2,0)", offset: 0.25 },
      { color: "rgba(20,12,2,0)", offset: 1 },
    ],
  },
];

const ORIGIN = 0;

/** Paints a vertical gradient into a canvas texture (no-op if it exists). */
export const createGradientTexture = (
  scene: Phaser.Scene,
  gradient: VerticalGradient,
  size: Readonly<{ height: number; width: number }>,
): void => {
  const texture = scene.textures.exists(gradient.key)
    ? null
    : scene.textures.createCanvas(gradient.key, size.width, size.height);

  if (texture === null) {
    return;
  }

  const fill = texture.context.createLinearGradient(
    ORIGIN,
    ORIGIN,
    ORIGIN,
    size.height,
  );

  for (const stop of gradient.stops) {
    fill.addColorStop(stop.offset, stop.color);
  }

  texture.context.fillStyle = fill;
  texture.context.fillRect(ORIGIN, ORIGIN, size.width, size.height);
  texture.refresh();
};
