import type { Unlock } from "../save/unlocks";

const UNLOCK_BANNERS: Readonly<
  Record<
    Unlock["kind"],
    Readonly<{ color: string; icon: string; suffix: string }>
  >
> = {
  character: { color: "#df00ff", icon: "🔓", suffix: "FREIGESCHALTET!" },
  map: { color: "#00d4ff", icon: "🗺️", suffix: "FREI!" },
};

/** Banner text and color announcing an unlock. */
export const describeUnlock = (
  unlock: Unlock,
): Readonly<{ color: string; text: string }> => {
  const banner = UNLOCK_BANNERS[unlock.kind];

  return {
    color: banner.color,
    text: `${banner.icon} ${unlock.name} ${banner.suffix}`,
  };
};
