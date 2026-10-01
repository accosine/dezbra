import type {
  Building,
  BuildingWindow,
  Decoration,
  Stain,
  World,
} from "./world";
import {
  createSeededRandom,
  type Random,
  randomChance,
  randomInteger,
} from "../utils/random";
import type { MapDefinition } from "../data/maps";
import type { Rect } from "../utils/collision";

const WORLD_TUNING = {
  blockInset: 22,
  buildingSeed: 12_345,
  centerClearance: 285,
  decorAttempts: 4,
  decorChance: 0.38,
  decorRotationStep: 90,
  decorRotations: 4,
  decorVariants: 4,
  litWindowChance: 0.09,
  lotColumnsForThree: 2,
  lotMarginMinimum: 10,
  lotMarginRange: 20,
  lotPadding: 9,
  lotRows: 2,
  maxBuildingsPerBlock: 3,
  minimumBuildingSize: 18,
  minimumWindows: 1,
  stainAlphaMinimum: 0.12,
  stainAlphaRange: 0.28,
  stainRadiusXMinimum: 5,
  stainRadiusXRange: 22,
  stainRadiusYMinimum: 4,
  stainRadiusYRange: 15,
  stainSeed: 77_777,
  windowBreakChance: 0.52,
  windowSpacing: 24,
};

const DOUBLE = 2;
const SINGLE_BUILDING = 1;
const LAST_LOT = 1;

type Block = Rect;
type BlockContent = Readonly<{
  buildings: ReadonlyArray<Building>;
  decorations: ReadonlyArray<Decoration>;
}>;

const createWindows = (
  columns: number,
  rows: number,
  context: Readonly<{ isDamaged: boolean; random: Random }>,
): ReadonlyArray<BuildingWindow> =>
  Array.from({ length: rows }, (_row, row) =>
    Array.from({ length: columns }, (_column, column): BuildingWindow => {
      const isLit = randomChance(context.random, WORLD_TUNING.litWindowChance);
      const isBroken =
        context.isDamaged &&
        randomChance(context.random, WORLD_TUNING.windowBreakChance);

      return { column, isBroken, isLit, row };
    }),
  ).flat();

const createBuilding = (
  lot: Rect,
  map: MapDefinition,
  random: Random,
): Building => {
  const paletteIndex = randomInteger(random, map.wallPalettes.length);
  const isDamaged = randomChance(random, map.buildingDamageChance);
  const countWindows = (length: number): number =>
    Math.max(
      WORLD_TUNING.minimumWindows,
      Math.floor(length / WORLD_TUNING.windowSpacing),
    );
  const windowColumns = countWindows(lot.width);
  const windowRows = countWindows(lot.height);

  return {
    height: Math.max(WORLD_TUNING.minimumBuildingSize, lot.height),
    isDamaged,
    paletteIndex,
    width: Math.max(WORLD_TUNING.minimumBuildingSize, lot.width),
    windowColumns,
    windowRows,
    windows: createWindows(windowColumns, windowRows, { isDamaged, random }),
    x: lot.x,
    y: lot.y,
  };
};

const createSingleLot = (block: Block, random: Random): Rect => {
  const margin =
    WORLD_TUNING.lotMarginMinimum +
    randomInteger(random, WORLD_TUNING.lotMarginRange);

  return {
    height: block.height - margin * DOUBLE,
    width: block.width - margin * DOUBLE,
    x: block.x + margin,
    y: block.y + margin,
  };
};

const createSplitLots = (
  block: Block,
  buildingCount: number,
): ReadonlyArray<Rect> => {
  const columns =
    buildingCount >= WORLD_TUNING.maxBuildingsPerBlock
      ? WORLD_TUNING.lotColumnsForThree
      : SINGLE_BUILDING;
  const padding = WORLD_TUNING.lotPadding;
  const width = (block.width - padding * (columns + SINGLE_BUILDING)) / columns;
  const height =
    (block.height - padding * (WORLD_TUNING.lotRows + SINGLE_BUILDING)) /
    WORLD_TUNING.lotRows;
  const lots = Array.from({ length: WORLD_TUNING.lotRows }, (_row, row) =>
    Array.from({ length: columns }, (_column, column) => ({ column, row })),
  ).flat();

  return lots
    .filter((lot) => lot.row !== LAST_LOT || lot.column !== LAST_LOT)
    .filter(
      () =>
        width > WORLD_TUNING.minimumBuildingSize &&
        height > WORLD_TUNING.minimumBuildingSize,
    )
    .map((lot) => ({
      height,
      width,
      x: block.x + padding + lot.column * (width + padding),
      y: block.y + padding + lot.row * (height + padding),
    }));
};

const generateBlockBuildings = (
  block: Block,
  map: MapDefinition,
  random: Random,
): ReadonlyArray<Building> => {
  const buildingCount =
    SINGLE_BUILDING + randomInteger(random, WORLD_TUNING.maxBuildingsPerBlock);
  const lots =
    buildingCount === SINGLE_BUILDING
      ? [createSingleLot(block, random)]
      : createSplitLots(block, buildingCount);

  return lots.map((lot) => createBuilding(lot, map, random));
};

const createDecoration = (
  block: Block,
  map: MapDefinition,
  random: Random,
): Decoration => {
  const x = block.x + random() * block.width;
  const y = block.y + random() * block.height;
  const type =
    map.decorTypes[randomInteger(random, map.decorTypes.length)] ?? "barrel";
  const rotation =
    randomInteger(random, WORLD_TUNING.decorRotations) *
    WORLD_TUNING.decorRotationStep;
  const variant = randomInteger(random, WORLD_TUNING.decorVariants);

  return { rotation, type, variant, x, y };
};

const generateBlockDecorations = (
  block: Block,
  map: MapDefinition,
  random: Random,
): ReadonlyArray<Decoration> =>
  Array.from({ length: WORLD_TUNING.decorAttempts }, () =>
    randomChance(random, WORLD_TUNING.decorChance)
      ? [createDecoration(block, map, random)]
      : [],
  ).flat();

const isCenterBlock = (block: Block, map: MapDefinition): boolean => {
  const center = map.worldSize / DOUBLE;

  return (
    Math.abs(block.x + block.width / DOUBLE - center) <
      WORLD_TUNING.centerClearance &&
    Math.abs(block.y + block.height / DOUBLE - center) <
      WORLD_TUNING.centerClearance
  );
};

const generateBlock = (
  block: Block,
  map: MapDefinition,
  random: Random,
): BlockContent => {
  if (isCenterBlock(block, map)) {
    return { buildings: [], decorations: [] };
  }

  const buildings = generateBlockBuildings(block, map, random);

  return {
    buildings,
    decorations: generateBlockDecorations(block, map, random),
  };
};

const listBlocks = (map: MapDefinition): ReadonlyArray<Block> => {
  const count = Math.floor(map.worldSize / map.blockSize);
  const inset = WORLD_TUNING.blockInset;

  return Array.from({ length: count }, (_row, row) =>
    Array.from({ length: count }, (_column, column) => ({
      height: map.blockSize - inset * DOUBLE,
      width: map.blockSize - inset * DOUBLE,
      x: column * map.blockSize + inset,
      y: row * map.blockSize + inset,
    })),
  ).flat();
};

const generateStains = (map: MapDefinition): ReadonlyArray<Stain> => {
  const random = createSeededRandom(WORLD_TUNING.stainSeed + map.worldSize);

  return Array.from({ length: map.stainCount }, (): Stain => {
    const x = random() * map.worldSize;
    const y = random() * map.worldSize;
    const radiusX =
      WORLD_TUNING.stainRadiusXMinimum +
      random() * WORLD_TUNING.stainRadiusXRange;
    const radiusY =
      WORLD_TUNING.stainRadiusYMinimum +
      random() * WORLD_TUNING.stainRadiusYRange;
    const alpha =
      WORLD_TUNING.stainAlphaMinimum + random() * WORLD_TUNING.stainAlphaRange;

    return { alpha, radiusX, radiusY, x, y };
  });
};

/** Generates buildings, decorations and stains exactly like the original game. */
export const generateWorld = (map: MapDefinition): World => {
  const random = createSeededRandom(WORLD_TUNING.buildingSeed + map.worldSize);
  const content = listBlocks(map).reduce<BlockContent>(
    (collected, block) => {
      const blockContent = generateBlock(block, map, random);

      return {
        buildings: [...collected.buildings, ...blockContent.buildings],
        decorations: [...collected.decorations, ...blockContent.decorations],
      };
    },
    { buildings: [], decorations: [] },
  );

  return { ...content, stains: generateStains(map) };
};
