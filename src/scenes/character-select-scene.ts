import * as Phaser from "phaser";
import { addCaption, addHeading } from "../ui/screen-text";
import {
  addSelectionContent,
  type Chip,
  type SelectionContent,
} from "../ui/selection-card";
import { BUTTON_COLORS, createButton } from "../ui/button";
import {
  CHARACTER_LIST,
  type CharacterDefinition,
  type StatTone,
} from "../data/characters";
import { isCharacterUnlocked, type Unlock } from "../save/unlocks";
import {
  readSave,
  readSelection,
  recordUnlocks,
  writeSelection,
} from "./game-registry";
import { createCard } from "../ui/card";
import { describeUnlock } from "./unlock-banners";
import { GAME_WIDTH } from "../constants";
import type { SaveData } from "../save/save-data";
import { SCENE_KEYS } from "./scene-keys";
import { showBanner } from "../ui/banner";
import { WEAPONS } from "../data/weapons";

const LAYOUT = {
  buttonY: 790,
  card: { gap: 6, height: 104, left: 10, top: 76, width: 410 },
  subtitleY: 56,
  titleY: 28,
};
const SELECTED = "#df00ff";
const TONE_COLORS: Readonly<Record<StatTone, string>> = {
  bad: "#e74c3c",
  good: "#27ae60",
  neutral: "#666666",
};
const BANNER_SPACING = 40;
const HALF = 0.5;

const describeCharacter = (
  character: CharacterDefinition,
  isLocked: boolean,
): SelectionContent => ({
  chips: character.stats.map((stat): Chip => ({
    color: TONE_COLORS[stat.tone],
    text: `${stat.label}: ${stat.value}`,
  })),
  description: character.description,
  detail: {
    color: "#ff9900",
    text: `START: ${[...new Set(character.startWeapons)].map((weaponId) => WEAPONS[weaponId].icon).join(" ")}`,
  },
  hint: character.unlock === null || !isLocked ? null : character.unlock.hint,
  icon: character.avatar,
  name: character.name,
  role: { color: character.color, text: character.role },
});

/** Announces everything that was unlocked since the last visit. */
export const announceUnlocks = (
  scene: Phaser.Scene,
  unlocks: ReadonlyArray<Unlock>,
): void => {
  for (const [index, unlock] of unlocks.entries()) {
    const banner = describeUnlock(unlock);

    showBanner(scene, banner.text, {
      color: banner.color,
      offsetY: index * BANNER_SPACING,
    });
  }
};

/** Lists the six characters; locked ones show how to unlock them. */
export class CharacterSelectScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.characterSelect);
  }

  private addCharacterCard(
    save: SaveData,
    character: CharacterDefinition,
    index: number,
  ): void {
    const { card } = LAYOUT;
    const isLocked = !isCharacterUnlocked(save, character.id);
    const isSelected =
      readSelection(this.registry).characterId === character.id;
    const container = createCard(this, {
      border: isSelected ? SELECTED : "#1e1e2a",
      fill: "#08080f",
      ...(isSelected && { glow: SELECTED }),
      height: card.height,
      isDimmed: isLocked,
      ...(!isLocked && { onPress: (): void => this.select(character) }),
      width: card.width,
      x: card.left,
      y: card.top + index * (card.height + card.gap),
    });

    addSelectionContent(
      this,
      container,
      describeCharacter(character, isLocked),
    );
  }

  private render(): void {
    const save = readSave(this.registry);

    addHeading(this, {
      color: SELECTED,
      text: "⚔️ CHARAKTER WÄHLEN",
      y: LAYOUT.titleY,
    });
    addCaption(this, {
      color: "#555555",
      text: "◆ SCHALTE HELDEN FREI ◆",
      y: LAYOUT.subtitleY,
    });
    for (const [index, character] of CHARACTER_LIST.entries()) {
      this.addCharacterCard(save, character, index);
    }
    createButton(this, {
      colors: BUTTON_COLORS.purple,
      label: "WEITER → KARTE WÄHLEN ▶",
      onPress: (): void => {
        this.scene.start(SCENE_KEYS.mapSelect);
      },
      width: LAYOUT.card.width,
      x: GAME_WIDTH * HALF,
      y: LAYOUT.buttonY,
    });
  }

  private select(character: CharacterDefinition): void {
    writeSelection(this.registry, { characterId: character.id });
    this.children.removeAll(true);
    this.render();
  }

  public create(): void {
    this.cameras.main.setBackgroundColor("#03030c");
    const unlocks = recordUnlocks(this.registry);

    this.render();
    announceUnlocks(this, unlocks);
  }
}
