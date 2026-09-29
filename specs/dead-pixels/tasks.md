# DEAD PIXELS — Tasks

## Fundament

- [x] T1 — Füge die `id-length`-Ausnahme für `x`/`y` in `eslint-config/rules.js` hinzu
- [ ] T2 — Implementiere `Brand`, `Vector` und `deepFreeze` in `src/utils/brand.ts`, `src/utils/vector.ts`, `src/utils/deep-freeze.ts`
- [ ] T3 — Implementiere Seed-Zufall und Hilfen in `src/utils/random.ts`
- [ ] T4 — Implementiere Mathe-Helfer (`clamp`, `distance`, `angleBetween`, `lerp`) in `src/utils/math.ts`
- [ ] T5 — Implementiere `pushCircleOutOfRects` und `isRectInView` in `src/utils/collision.ts`
- [ ] T6 — Implementiere `formatClock`, `formatScore` in `src/utils/format.ts` und Farbhilfen in `src/utils/color.ts`
- [ ] T7 — Implementiere `pickWeighted` in `src/utils/weighted-pick.ts`
- [ ] T8 — Implementiere Joystick-Mathe in `src/utils/joystick-math.ts`

## Kataloge

- [ ] T9 — Lege den Waffenkatalog in `src/data/weapons.ts` an
- [ ] T10 — Lege Perks, Beute und Bosse in `src/data/perks.ts`, `src/data/loot.ts`, `src/data/bosses.ts` an
- [ ] T11 — Lege Shop-Artikel in `src/data/shop-items.ts` an
- [ ] T12 — Lege Charaktere in `src/data/characters.ts` an
- [ ] T13 — Lege Karten und Paletten in `src/data/maps.ts` an
- [ ] T14 — Kodiere Pixel-Art in `src/data/character-sprites.ts` und `src/data/zombie-sprites.ts`
- [ ] T15 — Beschreibe Dekorationsformen in `src/data/decor-shapes.ts`

## Spielstand

- [ ] T16 — Implementiere Schema, Standardwerte und Validierung in `src/save/save-data.ts`
- [ ] T17 — Implementiere `loadSaveData`/`storeSaveData` in `src/save/save-storage.ts`
- [ ] T18 — Implementiere Fortschritt (`recordRunStart` …) in `src/save/progress.ts`
- [ ] T19 — Implementiere `applyUnlocks` in `src/save/unlocks.ts` und `purchaseShopItem` in `src/save/shop.ts`

## Simulation

- [ ] T20 — Definiere Zustands- und Eventtypen in `src/sim/game-state.ts`, `src/sim/entities.ts`, `src/sim/step-result.ts`
- [ ] T21 — Implementiere `generateWorld` in `src/sim/world-generation.ts`
- [ ] T22 — Implementiere `createRun` in `src/sim/create-run.ts`
- [ ] T23 — Implementiere Spielerbewegung und Timer in `src/sim/player.ts`
- [ ] T24 — Implementiere Spielerschaden, Schild und Wiederbelebung in `src/sim/player-damage.ts`
- [ ] T25 — Implementiere Partikel und schwebende Texte in `src/sim/particles.ts`
- [ ] T26 — Implementiere Waffenmuster in `src/sim/weapon-patterns.ts`
- [ ] T27 — Implementiere Feuer-Timer in `src/sim/weapons.ts`
- [ ] T28 — Implementiere Gegner-Spawn und -Bewegung in `src/sim/enemies.ts`
- [ ] T29 — Implementiere Bossverhalten und Boss-Spawn in `src/sim/boss.ts`
- [ ] T30 — Implementiere Kills, Combo und Punkte in `src/sim/kills.ts`
- [ ] T31 — Implementiere Kugelbewegung, Treffer und Explosionen in `src/sim/bullets.ts` und `src/sim/combat.ts`
- [ ] T32 — Implementiere XP-Kristalle und Level-Ups in `src/sim/experience.ts`
- [ ] T33 — Implementiere Wellen und Truhen in `src/sim/waves.ts` und `src/sim/chests.ts`
- [ ] T34 — Implementiere Upgrade-Angebote in `src/sim/upgrade-offers.ts`
- [ ] T35 — Implementiere `applyUpgrade` in `src/sim/apply-upgrade.ts`
- [ ] T36 — Implementiere Beute-Angebote und `applyLoot` in `src/sim/loot.ts`
- [ ] T37 — Verdrahte den Tick in `src/sim/step.ts` und Kamera/Zusammenfassung in `src/sim/camera.ts`, `src/sim/run-summary.ts`

## Rendering und UI

- [ ] T38 — Implementiere Textstile, Button, Karte und Balken in `src/ui/`
- [ ] T39 — Implementiere Banner und Joystick in `src/ui/banner.ts`, `src/ui/joystick.ts`
- [ ] T40 — Implementiere Pixel- und Dekor-Texturen in `src/render/pixel-texture.ts`, `src/render/decor-texture.ts`
- [ ] T41 — Implementiere Boden- und Gebäude-Renderer in `src/render/ground-renderer.ts`, `src/render/building-renderer.ts`
- [ ] T42 — Implementiere die Weltansicht in `src/render/world-view.ts`
- [ ] T43 — Implementiere Gegner-, Spieler- und Effekt-Renderer in `src/render/`
- [ ] T44 — Implementiere den Minimap-Renderer in `src/render/minimap-renderer.ts`

## Szenen

- [ ] T45 — Implementiere Szenen-Keys, Registry-Zugriff und `BootScene` in `src/scenes/`
- [ ] T46 — Implementiere `MenuScene` und `ShopScene`
- [ ] T47 — Implementiere `CharacterSelectScene` und `MapSelectScene`
- [ ] T48 — Implementiere `PlayScene`
- [ ] T49 — Implementiere `HudScene`
- [ ] T50 — Implementiere `UpgradeScene` und `ChestScene`
- [ ] T51 — Implementiere `GameOverScene`
- [ ] T52 — Verdrahte `game-config.ts`, `main.ts`, `index.html`, `style.css` und entferne das Boilerplate

## Abschluss

- [ ] T53 — Ergänze E2E-Smoke-Test in `e2e/`
- [ ] T54 — Aktualisiere `README.md` und `package.json`
- [ ] T55 — Führe die Review-Phase durch (Verification-Abschnitt in `spec.md`, Design-Drift)
