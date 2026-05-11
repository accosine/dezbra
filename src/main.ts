import "./style.css";
import * as Phaser from "phaser";
import { createGameConfig } from "./game-config";

export const game = new Phaser.Game(createGameConfig("game"));
