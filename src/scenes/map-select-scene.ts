import * as Phaser from "phaser";
import { addCaption, addHeading } from "../ui/screen-text";
import {
  addSelectionContent,
  type SelectionContent,
} from "../ui/selection-card";
import { BUTTON_COLORS, createButton } from "../ui/button";
import { MAP_IDS, type MapDefinition, MAPS } from "../data/maps";
import { readSave, readSelection, writeSelection } from "./game-registry";
import { createCard } from "../ui/card";
import { GAME_WIDTH } from "../constants";
import { isMapUnlocked } from "../save/unlocks";
import type { SaveData } from "../save/save-data";
import { SCENE_KEYS } from "./scene-keys";

const LAYOUT = {
  buttonY: 790,
  card: { gap: 10, height: 120, left: 10, top: 80, width: 410 },
  subtitleY: 56,
  titleY: 28,
};
const SELECTED = "#00d4ff";
const HALF = 0.5;

const describeMap = (
  map: MapDefinition,
  isLocked: boolean,
): SelectionContent => ({
  chips: map.features.map((feature) => ({ color: "#777777", text: feature })),
  description: map.description,
  detail: null,
  hint: map.unlock === null || !isLocked ? null : map.unlock.hint,
  icon: map.icon,
  name: map.name,
  role: { color: map.color, text: map.id.toUpperCase() },
});

/** Lists the four maps; the chosen one starts the run. */
export class MapSelectScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.mapSelect);
  }

  private addMapCard(save: SaveData, map: MapDefinition, index: number): void {
    const { card } = LAYOUT;
    const isLocked = !isMapUnlocked(save, map.id);
    const isSelected = readSelection(this.registry).mapId === map.id;
    const container = createCard(this, {
      border: isSelected ? SELECTED : "#1e1e2a",
      fill: map.cardColor,
      ...(isSelected && { glow: SELECTED }),
      height: card.height,
      isDimmed: isLocked,
      ...(!isLocked && { onPress: (): void => this.select(map) }),
      width: card.width,
      x: card.left,
      y: card.top + index * (card.height + card.gap),
    });

    addSelectionContent(this, container, describeMap(map, isLocked));
  }

  private render(): void {
    const save = readSave(this.registry);

    addHeading(this, {
      color: SELECTED,
      text: "🗺️ KARTE WÄHLEN",
      y: LAYOUT.titleY,
    });
    addCaption(this, {
      color: "#555555",
      text: "◆ JEDE KARTE SIEHT ANDERS AUS ◆",
      y: LAYOUT.subtitleY,
    });
    for (const [index, mapId] of MAP_IDS.entries()) {
      this.addMapCard(save, MAPS[mapId], index);
    }
    createButton(this, {
      colors: BUTTON_COLORS.blue,
      label: "▶ SPIELEN STARTEN",
      onPress: (): void => {
        this.scene.start(SCENE_KEYS.play);
      },
      width: LAYOUT.card.width,
      x: GAME_WIDTH * HALF,
      y: LAYOUT.buttonY,
    });
  }

  private select(map: MapDefinition): void {
    writeSelection(this.registry, { mapId: map.id });
    this.children.removeAll(true);
    this.render();
  }

  public create(): void {
    this.cameras.main.setBackgroundColor("#03030c");
    this.render();
  }
}
