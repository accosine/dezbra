# DEAD PIXELS

Ein Pixel-Art-Survival-Shooter im Stil von _Vampire Survivors_, gebaut mit **Phaser 4**, **TypeScript** und **Vite**.
Du kämpfst dich durch endlose Zombie-Wellen, sammelst Erfahrung, verbesserst und fusionierst Waffen und besiegst Bosse – im Hochformat, per Tastatur oder Touch-Joystick.

## Spielen

1. `pnpm install`
2. `pnpm dev`
3. Die angezeigte URL (typisch `http://localhost:5173`) im Browser öffnen.

### Steuerung

- **Desktop:** Pfeiltasten oder WASD
- **Mobil:** virtueller Joystick unten links
- Waffen feuern automatisch auf den nächsten Gegner.

### Spielinhalte

- **6 Charaktere** mit eigenen Werten und Startwaffen – weitere werden durch Erfolge freigeschaltet
- **4 Karten** (Verlassene Stadt, Industriegebiet, Vergessener Friedhof, Ödland) mit eigener Palette und Dekoration
- **Waffen, Level-ups und Fusionen:** Bei jedem Level-up wählst du aus drei Angeboten; bestimmte Waffenpaare lassen sich zu mächtigen Fusionswaffen kombinieren
- **Wellen, Truhen und Bosse:** Nach jeder Welle wartet Beute, regelmäßig erscheinen Bosse mit eigenen Angriffsmustern
- **Combo-System**, Minimap und Highscore
- **Shop:** Mit gesammelten Münzen dauerhafte Verbesserungen kaufen
- Fortschritt wird im `localStorage` gespeichert

## Voraussetzungen

- **Node.js 24 oder neuer**
- **pnpm 11** (Version aus `packageManager`)

## Wichtige pnpm-Befehle

| Befehl                    | Zweck                                       |
| ------------------------- | ------------------------------------------- |
| `pnpm dev`                | Entwicklungsserver mit HMR                  |
| `pnpm build`              | Typprüfung + Produktionsbuild               |
| `pnpm preview`            | Vorschau des Produktionsbuilds              |
| `pnpm format`             | Prettier                                    |
| `pnpm lint`               | ESLint                                      |
| `pnpm typecheck`          | TypeScript-Typprüfung                       |
| `pnpm test`               | Unit- und E2E-Tests                         |
| `pnpm test:unit:chromium` | Unit-Tests in Chromium inkl. 100 %-Coverage |
| `pnpm test:unit:firefox`  | Unit-Tests in Firefox                       |
| `pnpm test:unit:webkit`   | Unit-Tests in WebKit                        |
| `pnpm test:e2e`           | Playwright (Desktop- und Mobil-Viewports)   |
| `pnpm ok`                 | format, lint, test, typecheck und build     |

## Architektur

Die Spiellogik ist strikt von Phaser getrennt. Die Simulation ist eine reine Funktion
`stepGame(state, input, random) → { state, events }` über einem unveränderlichen `GameState`
und läuft in festen 1/60-s-Ticks. Phaser-Szenen rendern nur den Zustand und reichen Eingaben weiter.

```text
src/
├─ utils/    domänenunabhängige Helfer (Zufall, Mathe, Kollision, Farben …)
├─ data/     Kataloge: Waffen, Perks, Beute, Bosse, Charaktere, Karten, Pixel-Sprites
├─ save/     Spielstand, Fortschritt, Freischaltungen, Shop
├─ sim/      reine Simulation (Weltgenerierung, Gegner, Waffen, Wellen, Upgrades …)
├─ render/   prozedurale Texturen und Ansichten für Welt, Gegner, Spieler, Effekte
├─ ui/       wiederverwendbare Phaser-Bausteine (Buttons, Karten, Banner, Joystick)
├─ scenes/   Boot, Menü, Auswahl, Shop, Spiel, HUD, Overlays, Game Over
├─ harness/  Testhilfen, die echte Phaser-Instanzen im Browser starten
├─ game-config.ts
└─ main.ts
e2e/         Playwright-Smoke-Tests
specs/       Spezifikation, Design und Aufgabenliste (inkl. Original-Vorlage)
```

Details stehen in [`specs/dead-pixels/design.md`](specs/dead-pixels/design.md).

## CI (GitHub Actions)

Die Workflows unter `.github/workflows` prüfen Format, Linting, Typen, Build,
Unit-Tests (Chromium, Firefox, WebKit) und E2E-Tests (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari).

## Beiträge

1. Feature-Branch erstellen
2. Änderungen testgetrieben umsetzen (siehe `AGENTS.md`)
3. `pnpm ok` ausführen
4. Commit (Conventional Commits) und Pull Request erstellen
