# DEAD PIXELS — Port nach Phaser 4

## Ziel

Das Repository wird vom Phaser-Boilerplate zum Spiel **DEAD PIXELS** umgebaut. Vorlage ist die
Single-File-Version `reference/dead-pixels.html` (Canvas2D + DOM, ca. 2000 Zeilen Vanilla-JS). Das
Spiel wird **vollständig in Phaser 4** neu aufgebaut: Spielwelt, Menüs, HUD und Overlays sind
Phaser-Szenen bzw. Game Objects, die Spiellogik ist reines, deterministisch testbares TypeScript.
Spielerisch soll sich der Port wie die Vorlage anfühlen (gleiche Inhalte, gleiche Tuning-Werte).

## Benutzer-sichtbares Verhalten

- **Hauptmenü**: Titel „DEAD PIXELS“, Untertitel „◆ DEAD CITY ◆“, Buttons „▶ SPIELEN“ und „🛒 SHOP“,
  Kurzhilfe.
- **Charakterwahl**: 6 Charaktere (Soldat, Anna Krieg, Max Blitz, Zara Void, Iron Hans, Shade X) als
  Karten mit Avatar, Klasse, Beschreibung, Startwaffen und Stat-Chips. Gesperrte Charaktere sind
  abgedunkelt und zeigen ihre Freischaltbedingung. Auswahl + „WEITER → KARTE WÄHLEN ▶“.
- **Kartenwahl**: 4 Karten (Verlassene Stadt, Industriegebiet, Vergessener Friedhof, Ödland) mit
  Features; gesperrte Karten zeigen die Bedingung. „▶ SPIELEN STARTEN“ startet den Run.
- **Shop**: 6 permanente Upgrades (Startpanzerung, Startschild, XP-Boost, Dauertraining,
  Schnellfeuer, Phönix) gegen Münzen; gekaufte sind markiert, unbezahlbare abgedunkelt.
- **Spiel**:
  - Top-Down-Welt je Karte (Bodenmuster, Gebäude mit Fenstern, Dekoration, Flecken), Kamera folgt dem
    Spieler und bleibt in den Weltgrenzen. Gebäude blockieren Spieler und Gegner.
  - Bewegung per WASD/Pfeiltasten oder virtuellem Joystick (unten links); alle Waffen feuern
    automatisch auf den nächsten Gegner.
  - 8 Basiswaffen (Pistole, Schrotflinte, Uzi, Scharfschütze, Magiestab, Bumerang, Granate, Laser)
    mit Level 1–5 und 6 Fusionen (Höllenfeuer, Todesstrahl, Leerer Orb, Apokalypse, Sturmwind,
    Napalm).
  - Zombies in 3 Varianten + große „Brutes“ (Krone) und schnelle Gegner; Spawn-Ring, HP-Balken.
  - Wellen alle 30 s (Heilung, Banner), Bosse in den Wellen 3/5/8/12/18 (Fleischberg, Pestpriester,
    Giftspucker, Todesritter, Alptraum) mit Spezialangriffen (Ansturm, Beschwörung, Giftring,
    Schüsse), Boss-Leiste oben.
  - Boss-Kill hinterlässt eine Schatztruhe → Auswahl aus 3 von 15 Beutestücken.
  - XP-Kristalle mit Magnetradius; Level-Up → Auswahl aus 3 Angeboten (Perks nach Seltenheit,
    Waffen-Level, neue Waffen, garantierte Fusion wenn möglich).
  - Combo-System (Multiplikator bis ×8, Streak-Banner bei jedem 5er), schwebende Punktetexte,
    Screen-Shake, Level-Up-Flash, Vignette, Einfrier-Tönung.
  - HUD: Leben, EXP, Level, Punkte, Zeit, Welle, Kills, Bestwert, Wellen-Timer, Waffenleiste,
    Minimap, Gegnerzähler, Combo-Anzeige.
  - Charakter-Passive: Soldat (Schild jede volle Minute), Blitz (+3 % Feuerrate je Level, max
    +50 %), Zara (Orbs verlangsamen), Hans (65 % Schaden, Regen, Schild), Shade X (durchdringende
    Kugeln, kurze Unverwundbarkeit beim Laufen).
- **Game Over**: „DU BIST TOT“, Punkte (⭐ bei neuem Bestwert), Zeit, Kills, verdiente Münzen,
  Waffen-Icons, nächstes Freischaltziel, „↺ NOCHMAL“ (→ Charakterwahl) und „⌂ HAUPTMENÜ“.
- **Fortschritt** bleibt im `localStorage` erhalten: Bestwert, Gesamtkills, gespielte Runs, besiegte
  Bosse, gebaute Fusionen, Münzen, freigeschaltete Charaktere/Karten, Shop-Käufe. Freischaltungen
  werden mit Banner angezeigt.
- Darstellung im Hochformat (Designauflösung 430 × 830), skaliert per `FIT`, Pixel-Art ohne
  Glättung, Schrift „Press Start 2P“ (lokal gebündelt).

## Außerhalb des Scopes

- Sound/Musik (die Vorlage hat keine).
- Neue Inhalte, Balancing-Änderungen oder Online-Funktionen.
- Übernahme alter Spielstände der HTML-Version (anderer Origin, anderes Schema).
- Annas Passive „Präzisionsschüsse“ ist in der Vorlage nur Text ohne Wirkung und bleibt es.

## Entscheidungen zu Unklarheiten (geklärt)

- **Engine**: komplett Phaser (Entscheidung des Benutzers), volle Feature-Parität.
- **Zeitbasis**: Die Vorlage rechnet in Frames bei 60 FPS. Der Port simuliert in festen Ticks à
  1/60 s (Akkumulator über `delta`), damit alle Tuning-Werte unverändert gelten.
- **Schriftgröße**: Die Vorlage nutzt 4–6 px HTML-Text. Da im Port aller Text im Canvas liegt,
  gilt 8 px (native Größe von „Press Start 2P“) als Minimum.
- **Offensichtliche Fehler der Vorlage werden behoben**, ohne das Spielgefühl zu ändern:
  - Treffer-Merkliste der Kugeln nutzt Gegner-IDs statt Array-Indizes (Indizes verschieben sich).
  - Spawn-Zähler wird nur einmal pro Tick reduziert (die Vorlage reduziert zusätzlich beim Zeichnen).
  - Mehrere Level-Ups auf einmal werden nacheinander angeboten (die Vorlage zeigt nur eines).
  - Der Perk „Zeitstopp“ friert – wie beschrieben – alle 20 s ein (Vorlage: nur einmal).
  - Shade X’ Unverwundbarkeit beim Laufen gilt auch für Tastatursteuerung.
  - Roter Treffer-Blitz erscheint direkt nach einem Treffer (Vorlage: Bedingung nie erfüllbar).
  - Hinweis auf dem Game-Over-Screen wird nicht mehrfach eingefügt.
- **Münzen** eines Runs werden beim Run-Ende gutgeschrieben (Vorlage: laufend, aber erst bei
  Boss-Kill/Game Over gespeichert — im normalen Spielfluss identisch).
- **Welt-Generierung** nutzt denselben Seed-Generator und dieselbe Reihenfolge der Zufallszahlen wie
  die Vorlage, sodass Karten identisch aussehen.

## Edge Cases

- `localStorage` nicht verfügbar oder beschädigt → Standard-Spielstand, keine Exception.
- Unbekannte/fehlende Felder im Spielstand → werden mit Standardwerten ergänzt.
- Keine Gegner vorhanden → Waffen zielen in Blickrichtung (bzw. zufällig bei Napalm).
- Gleichzeitiges Level-Up und Truhe → Truhe zuerst, danach alle ausstehenden Level-Ups.
- Tod mit Wiederbelebung → einmalig 32 % HP, Banner.
- Alle Angebote ausgeschöpft → weniger als 3 Karten werden angezeigt (nie leer, solange Perks
  existieren).
- Resize/Orientierungswechsel → `FIT` skaliert, Layout bleibt stabil.
- Tab im Hintergrund (großes `delta`) → Anzahl nachzuholender Ticks wird begrenzt.

## Verification

| Anforderung                                   | Nachweis                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------- |
| Weltgenerierung identisch zur Vorlage         | `src/sim/world-generation.test.ts` (Referenzwerte des Original-LCG)               |
| Spielstand robust bei defektem `localStorage` | `src/save/save-storage.test.ts`, `src/save/save-data.test.ts`                     |
| Waffen, Fusionen, Perks, Beute                | `src/sim/weapon-*.test.ts`, `apply-upgrade.test.ts`, `loot.test.ts`               |
| Wellen, Bosse, Truhen, Level-ups              | `src/sim/waves.test.ts`, `boss*.test.ts`, `chests.test.ts`, `experience.test.ts`  |
| Truhe vor Level-up, mehrere ausstehend        | `src/sim/phase.test.ts`, `src/scenes/play-flow.test.ts`, `play-edges.test.ts`     |
| Wiederbelebung einmalig                       | `src/sim/player-damage.test.ts`                                                   |
| Große `delta`-Werte begrenzt                  | `src/scenes/play-edges.test.ts`                                                   |
| Menüfluss, Auswahl, Shop, Freischaltungen     | `src/scenes/menu-shop.test.ts`, `selection-scenes.test.ts`, `play-events.test.ts` |
| HUD, Overlays, Game Over                      | `src/scenes/play-*.test.ts`, `overlays-alone.test.ts`                             |
| Ohne Tastatur spielbar (Touch)                | `src/scenes/play-edges.test.ts`, `src/ui/ui-feedback.test.ts`                     |
| Seite startet fehlerfrei, Canvas sichtbar     | `e2e/game-canvas.spec.ts` (Desktop- und Mobil-Viewports)                          |

Alle Unit-Tests laufen mit 100 % Coverage (Zeilen, Branches, Funktionen, Statements).
