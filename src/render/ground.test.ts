import {
  createHorizontalDashes,
  listGridLines,
  transposeSegments,
} from "./ground-grid";
import { describe, expect, it } from "vitest";
import { MAP_IDS, MAPS } from "../data/maps";
import { samplePixel, useHarnessScene } from "../harness/phaser-harness";
import { drawGround } from "./ground-renderer";
import { hexToNumber } from "../utils/color";
import { listSteps } from "./paint";

const getScene = useHarnessScene();
const VIEW = { height: 200, width: 200, x: 0, y: 0 };
const SIDEWALK_POINT = { x: 100, y: 100 };
const OPAQUE = 255;
const FRAME = 120;
const HEX = { padding: 2, radix: 16 };

const toColorNumber = (
  color: Readonly<{ blue: number; green: number; red: number }>,
): number =>
  hexToNumber(
    `#${[color.red, color.green, color.blue].map((channel) => channel.toString(HEX.radix).padStart(HEX.padding, "0")).join("")}`,
  );

const STEPS = {
  end: 10,
  expected: [{ at: 0 }, { at: 4 }, { at: 8 }],
  start: 0,
  step: 4,
};
const EMPTY_STEPS = { end: 0, start: 5, step: 1 };
const GRID = {
  expected: {
    columns: [{ at: -50 }, { at: 50 }, { at: 150 }],
    rows: [{ at: -30 }, { at: 70 }, { at: 170 }],
  },
  spacing: 100,
  view: { height: 100, width: 100, x: 150, y: 30 },
};
const DASHES = {
  expected: [
    { fromX: 0, fromY: 7, toX: 5, toY: 7 },
    { fromX: 15, fromY: 7, toX: 25, toY: 7 },
    { fromX: 35, fromY: 7, toX: 40, toY: 7 },
  ],
  line: { length: 40, offset: 5, y: 7 },
  pattern: { dash: 10, gap: 10 },
  shifted: { firstStart: 5, line: { length: 40, offset: 15, y: 0 } },
};
const SEGMENT = { fromX: 1, fromY: 2, toX: 3, toY: 4 };
const FIRST = 0;

const wrap = (
  values: ReadonlyArray<number>,
): ReadonlyArray<Readonly<{ at: number }>> => values.map((at) => ({ at }));

describe("grid geometry", (): void => {
  it("lists steps and visible grid lines", (): void => {
    const lines = listGridLines(GRID.view, GRID.spacing);

    expect(wrap(listSteps(STEPS.start, STEPS.end, STEPS.step))).toEqual(
      STEPS.expected,
    );
    expect(
      listSteps(EMPTY_STEPS.start, EMPTY_STEPS.end, EMPTY_STEPS.step),
    ).toEqual([]);
    expect({ columns: wrap(lines.columns), rows: wrap(lines.rows) }).toEqual(
      GRID.expected,
    );
  });

  it("anchors dashes to the world and clips them to the line", (): void => {
    expect(createHorizontalDashes(DASHES.line, DASHES.pattern)).toEqual(
      DASHES.expected,
    );
    expect(
      createHorizontalDashes(DASHES.shifted.line, DASHES.pattern).at(FIRST)
        ?.fromX,
    ).toBe(DASHES.shifted.firstStart);
    expect(transposeSegments([SEGMENT])).toEqual([
      {
        fromX: SEGMENT.fromY,
        fromY: SEGMENT.fromX,
        toX: SEGMENT.toY,
        toY: SEGMENT.toX,
      },
    ]);
  });
});

describe("drawGround", (): void => {
  it.each(MAP_IDS)("paints an opaque %s ground", (mapId): void => {
    const graphics = getScene().add.graphics();

    drawGround(graphics, { frame: FRAME, map: MAPS[mapId], view: VIEW });

    expect(samplePixel(graphics, VIEW, SIDEWALK_POINT).alpha).toBe(OPAQUE);
  });

  it("draws city sidewalks inside the blocks", (): void => {
    const graphics = getScene().add.graphics();

    drawGround(graphics, { frame: FRAME, map: MAPS.city, view: VIEW });

    expect(toColorNumber(samplePixel(graphics, VIEW, SIDEWALK_POINT))).toBe(
      hexToNumber(MAPS.city.sidewalkColor),
    );
  });
});
