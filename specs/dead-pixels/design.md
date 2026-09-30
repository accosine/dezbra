# DEAD PIXELS — Design

## Schichten

```text
scenes/  ──►  render/  ──►  ui/          (Phaser-abhängig)
   │            │
   ▼            ▼
  sim/  ──►  data/  ──►  utils/          (reines TypeScript, ohne Phaser)
   │
   ▼
  save/ ──►  data/, utils/
```

Abhängigkeiten zeigen nur nach unten bzw. rechts. `sim/`, `save/`, `data/` und `utils/` importieren
niemals Phaser; sie laufen in Unit-Tests ohne Game-Instanz.

| Schicht   | Verantwortung                                                                              |
| --------- | ------------------------------------------------------------------------------------------ |
| `utils/`  | Domänenfreie Helfer: Seed-Zufall, Mathe, Kollision Kreis/Rechteck, Formatierung, Farben.   |
| `data/`   | Eingefrorene Kataloge: Waffen, Charaktere, Karten, Perks, Beute, Bosse, Shop, Pixel-Art.   |
| `save/`   | Spielstand: Schema, Validierung aus `unknown`, Speicherung, Fortschritt, Freischaltungen.  |
| `sim/`    | Spielsimulation als reine Funktionen `(state, context) → { state, events }` pro Tick.      |
| `render/` | Übersetzt `GameState` in Phaser-Objekte (Welt, Gegner, Effekte, Minimap, Texturen).        |
| `ui/`     | Wiederverwendbare Phaser-Bausteine: Textstile, Button, Karte, Balken, Banner, Joystick.    |
| `scenes/` | Ablauf: Boot → Menü → Charakter → Karte → Spiel (+ HUD, Upgrade, Truhe) → Game Over, Shop. |

## Datenfluss im Spiel

```text
 keyboard/joystick ──► PlayScene.update(delta)
                          │  Akkumulator, je 1/60 s:
                          ▼
            stepGame(state, { movement, random }) ──► { state', events[] }
                          │                              │
                          ▼                              ▼
              render/* (Welt, Gegner, Effekte)   Banner/Streak/Boss → HudScene (PlayScene.onRunEvent)
                          │                      Upgrade/Truhe      → Overlay-Szene (Phase ≠ "playing")
                          ▼                      Tod                → finalizeRun + GameOverScene
                   HudScene liest PlayScene.snapshot in update()
```

Overlays und HUD greifen ausschließlich über die öffentliche API der `PlayScene` zu
(`snapshot`, `level`, `pendingUpgrades`, `pendingLoot`, `runReport`, `chooseUpgrade`,
`chooseLoot`, `onRunEvent`, `setJoystick`). `restoreState(state)` setzt einen beliebigen Zustand
und dient Tests als Einstieg in seltene Situationen (Boss, Fusion, Tod).

## Zentrale Typen (`sim/game-state.ts`, `sim/entities.ts`)

- `GameState = Readonly<{ bullets, character, chests, enemies, floats, gems, map, particles, phase,
player, progress, stats, weapons, world }>`; Feuer-Timer stecken in `WeaponSlot.cooldownTicks`.
- `phase: "playing" | "upgrade" | "chest" | "dead"` — nur in `"playing"` wird simuliert.
- Entitäten (`Enemy`, `Bullet`, `Particle`, `Gem`, `FloatingText`, `Chest`) sind `Readonly`,
  Listen `ReadonlyArray`. Jeder Tick erzeugt neue Objekte statt zu mutieren.
- `EnemyId = Brand<number, "EnemyId">` (C-4); Katalog-IDs (`WeaponId`, `CharacterId`, `MapId`,
  `PerkId`, `LootId`, `ShopItemId`) sind String-Literal-Unions.
- `GameEvent` — diskriminierte Union (`banner`, `streak`, `boss-spawned`, `boss-defeated`,
  `level-up`, `chest-found`, `player-died`, `fusion-built`); die Wiederbelebung meldet sich als
  `banner`.
- `StepContext = Readonly<{ movement: Vector; random: Random }>`; `Random = () => number` wird
  injiziert (Tests nutzen `createSeededRandom` bzw. `fixedRandom`/`sequenceRandom` aus
  `sim/sim-fixtures.ts`).
- Alle Tuning-Werte der Vorlage liegen gebündelt in `sim/tuning.ts`.

Laufzeit-Immutabilität: Kataloge in `data/` werden mit `Object.freeze` (rekursiv, `deepFreeze`)
eingefroren. Der Tick-Zustand wird nie mutiert (neue Objekte je Tick); ein Einfrieren pro Tick wurde
wegen der Allokationskosten bei hunderten Entitäten verworfen.

## Öffentliche API (Auszug)

| Modul                     | Export                                                                            |
| ------------------------- | --------------------------------------------------------------------------------- |
| `utils/random.ts`         | `createSeededRandom(seed)`, `randomBetween`, `randomInteger`, `shuffle`           |
| `utils/collision.ts`      | `pushCircleOutOfRects(circle, rects) → Vector`                                    |
| `sim/world-generation.ts` | `generateWorld(map) → World`                                                      |
| `sim/create-run.ts`       | `createRun({ character, map, save }) → GameState`                                 |
| `sim/step.ts`             | `stepGame(state, context) → StepResult`                                           |
| `sim/upgrade-offers.ts`   | `createUpgradeOffers(state, random) → ReadonlyArray<UpgradeOffer>`                |
| `sim/apply-upgrade.ts`    | `applyUpgrade(state, offer) → StepResult`                                         |
| `sim/loot.ts`             | `createLootOffers(random)`, `applyLoot(state, lootId) → StepResult`               |
| `sim/run-summary.ts`      | `summarizeRun(state) → RunSummary`                                                |
| `save/save-data.ts`       | `parseSaveData(unknown) → SaveData`, `DEFAULT_SAVE_DATA`                          |
| `save/save-storage.ts`    | `loadSaveData(storage)`, `storeSaveData(storage, save)`                           |
| `save/progress.ts`        | `recordRunStart`, `recordBossKill`, `recordFusion`, `recordRunEnd`                |
| `save/unlocks.ts`         | `applyUnlocks(save) → { save, unlocked }`                                         |
| `save/shop.ts`            | `purchaseShopItem(save, itemId) → SaveData`                                       |
| `render/pixel-texture.ts` | `createPixelTexture(scene, key, sprite, scale)`                                   |
| `render/world-view.ts`    | `createWorldView(scene, world, map)`, `updateWorldView(view, { frame, visible })` |
| `ui/joystick.ts`          | Klasse `Joystick` (Container); Mathe in `utils/joystick-math.ts`                  |
| `scenes/run-report.ts`    | `finalizeRun(registry, state) → RunReport` (Spielstand + Unlocks)                 |

## Rendering-Entscheidungen

- **Pixel-Sprites** (Charaktere 10×16, Zombies 7×12) sind als Palette-Strings kodiert (`"..hHh.."`
  plus Farbtabelle) und werden in der Boot-Szene einmalig per `Graphics.generateTexture` zu
  Texturen. Alternative: Pixel pro Frame zeichnen wie die Vorlage — verworfen (tausende `fillRect`
  je Frame).
- **Dekoration** ist als Liste primitiver Formen (Rechteck, Kreis, Ellipse) pro Typ beschrieben und
  wird zu Texturen gebacken; Platzierung als `Image` mit Rotation.
- **Gebäude**: ein `Graphics` pro Gebäude, einmalig gezeichnet, pro Frame per Sichtbarkeitstest
  (`isRectInView`) ein-/ausgeblendet. Alternative: Welt in RenderTextures backen — verworfen
  (bis 5000² px Speicher, v. a. mobil).
- **Boden** (Straßen, Fliesen, Nebel, Dünen) wird kamerarelativ pro Frame in ein `Graphics` mit
  `scrollFactor 0` gezeichnet, wie in der Vorlage.
- **Dynamisches** (Kugeln, Partikel, Kristalle, Truhen, Ringe, HP-Balken) in ein Welt-`Graphics`,
  das pro Frame geleert wird; Gegner und Spieler als `Image`-Pools; schwebende Texte als `Text`-Pool.
- **HUD** in einer parallelen `HudScene` über der Spielszene; Minimap-Gebäude einmalig in eine
  Textur gebacken, Punkte pro Frame.

## Testbarkeit

- `sim/`, `save/`, `data/`, `utils/`: reine Unit-Tests mit Seed-Zufall (FIRST, Black-Box über
  exportierte Funktionen).
- `render/`, `ui/`, `scenes/`: Tests booten über `src/harness/` (von der Coverage ausgenommen)
  eine echte Phaser-Instanz und prüfen beobachtbares Verhalten: aktive Szenen, Texte, Pixel
  gebackener Texturen (`textures.getPixel`), Sichtbarkeit von Objekten, Reaktion auf
  Pointer-/Tasten-Events. Banner entfernen sich per `scene.time.delayedCall`, damit Tests mit
  `stepFrames` deterministisch bleiben (Tweens laufen auf der Wanduhr).
- Coverage-Schwelle bleibt bei 100 %.

## Tooling-Anpassungen

- `id-length`: Ausnahme für `x` und `y`. Begründung: Koordinaten sind das zentrale Domänenvokabular
  (C-2) eines 2D-Spiels; Phaser selbst verwendet `x`/`y`. Alternative (`positionX` o. ä. bzw.
  berechnete Keys wie im alten Test) verworfen — schlechter lesbar.
- Neue Abhängigkeit `@fontsource/press-start-2p` (OFL-1.1) statt Google-Fonts-Request
  (offline-fähig, keine Drittanbieter-Anfrage).
- `tsconfig`-Lib auf ES2023 angehoben (`toSorted`, `findLast`).

## Tradeoffs

- **Komplett Phaser vs. DOM-Overlays**: DOM wäre näher am Original-CSS, der Benutzer hat sich für
  komplett Phaser entschieden. Folge: Menüs werden mit `ui/`-Bausteinen nachgebaut.
- **Unveränderlicher Tick-Zustand vs. Mutation**: Mutation wäre schneller, widerspricht aber den
  Readonly-Regeln und erschwert Tests. Bei ≤ 80 Gegnern und wenigen hundert Kugeln/Partikeln sind die
  Allokationen unkritisch.
- **Feste Ticks vs. delta-skalierte Physik**: Delta-Skalierung würde alle Tuning-Werte der Vorlage
  verändern; feste Ticks bewahren sie exakt.
- **Implementierung + Test in einer Aufgabe**: abweichend von S-16 gebündelt, weil jede Aufgabe die
  100-%-Coverage-Schwelle erfüllen muss, um committet werden zu können.

## Reuse Map

- `src/game-config.ts` → erweitert (Szenenliste, Scale FIT/`CENTER_BOTH`, `pixelArt`, zwei Pointer).
- `src/main-scene.ts` + Test, `src/example.test.ts` → entfernt, ersetzt durch `scenes/*` und `harness/`.
- `e2e/game-canvas.spec.ts` → bleibt, ergänzt um einen Spielablauf-Smoke-Test.
- `reference/dead-pixels.html` → Quelle aller Tuning-Werte, Texte und Pixel-Art.
