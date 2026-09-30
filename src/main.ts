import "@fontsource/press-start-2p";
import "./style.css";
import * as Phaser from "phaser";
import { createGameConfig } from "./game-config";
import { GAME_PARENT_ID } from "./constants";

export const game = new Phaser.Game(createGameConfig(GAME_PARENT_ID));
