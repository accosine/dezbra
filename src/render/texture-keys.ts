import type { CharacterId } from "../data/characters";
import type { DecorType } from "../data/decor-shapes";

/** Texture keys of everything generated at boot. */
export const TEXTURE_KEYS = {
  brute: "zombie-brute",
  glare: "overlay-glare",
  mist: "overlay-mist",
  stain: "stain",
  vignette: "vignette",
};

/** Texture key of a character sprite. */
export const getCharacterTextureKey = (characterId: CharacterId): string =>
  `character-${characterId}`;

/** Texture key of a regular zombie variant (0–2). */
export const getZombieTextureKey = (variant: number): string =>
  `zombie-${variant}`;

/** Texture key of a decoration in one of its color variants. */
export const getDecorTextureKey = (type: DecorType, variant: number): string =>
  `decor-${type}-${variant}`;
