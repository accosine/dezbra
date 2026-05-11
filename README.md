# Phaser 4 + Vite + TypeScript Boilerplate

Ein schlankes Starter-Projekt für Browser-Games mit **Phaser 4**, **TypeScript** und **Vite**.
Die Vorlage ist sowohl für den schnellen Einstieg in ein neues Spiel als auch für saubere Team-Entwicklung mit Tests, Linting und CI gedacht.

## Für wen ist dieses Projekt?

- **Spieler:innen / Nutzer:innen**
  - Starten das Spiel lokal im Browser.
  - Testen einfache Interaktionen (z. B. Klick/Tap-Effekte).
- **Entwickler:innen**
  - Erhalten ein vorkonfiguriertes Setup mit TypeScript, Vitest, Playwright, ESLint, Prettier und CI-Workflows.

## Features

- Phaser-4-Spielgrundgerüst mit einer `MainScene`
- Vite als schneller Dev-Server und Build-Tool
- TypeScript-Setup inkl. Typecheck
- Unit-Tests (Vitest im Browser)
- E2E-Tests (Playwright, inkl. Desktop + Mobile Viewports)
- ESLint + Prettier
- GitHub-Actions-Workflows für Validierung und Build

## Voraussetzungen

- **Node.js 24 oder neuer**
- **pnpm 11**

> Empfohlen: Verwende exakt die im Projekt hinterlegte pnpm-Version aus `packageManager`.

## Installation

```bash
pnpm install
```

## Lokale Entwicklung

Dev-Server starten:

```bash
pnpm dev
```

Danach die angezeigte lokale URL im Browser öffnen (typisch: `http://localhost:5173`).

## Nutzung als Spieler:in

Nach dem Start siehst du eine einfache Demo-Szene:

- Titeltext in der Szene
- Ein animiertes Controller-Emoji
- Bei Klick/Tap wird an der Pointer-Position ein Kreis gezeichnet

Damit kannst du schnell prüfen, ob Rendering, Input und Animation korrekt funktionieren.

## Wichtige pnpm-Befehle

### Entwicklung & Build

- `pnpm dev` – lokaler Entwicklungsserver mit HMR
- `pnpm build` – TypeScript-Kompilierung + Produktionsbuild via Vite
- `pnpm preview` – lokale Vorschau des Production-Builds

### Qualitätssicherung

- `pnpm format` – formatiert Code mit Prettier
- `pnpm lint` – statische Analyse mit ESLint
- `pnpm typecheck` – TypeScript-Typprüfung

### Tests

- `pnpm test` – komplette Test-Suite (Unit + E2E)
- `pnpm test:unit:chromium` – Unit-Tests in Chromium (inkl. Coverage)
- `pnpm test:unit:firefox` – Unit-Tests in Firefox
- `pnpm test:unit:webkit` – Unit-Tests in WebKit
- `pnpm test:e2e` – E2E-Tests mit Playwright

### All-in-One Check

- `pnpm ok` – führt nacheinander aus:
  - `format`
  - `lint`
  - `test`
  - `typecheck`
  - `build`

Dieser Befehl eignet sich ideal vor Commits oder Pull Requests.

## CI (GitHub Actions)

Das Repository enthält mehrere Workflows unter `.github/workflows`, u. a. für:

- **Format-Check**
- **Linting**
- **Typecheck**
- **Build**
- **Unit-Tests** (Chromium, Firefox, WebKit)
- **E2E-Tests** (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)

So wird sichergestellt, dass Änderungen auf mehreren Browsern und Viewports verlässlich geprüft werden.

## Projektstruktur (Kurzüberblick)

```text
.
├─ src/
│  ├─ main.ts
│  ├─ main-scene.ts
│  ├─ constants.ts
│  └─ *.test.ts
├─ e2e/
│  └─ *.spec.ts
├─ .github/workflows/
├─ vite.config.ts
├─ vitest.config.ts
├─ playwright.config.ts
└─ package.json
```

## Häufiger Workflow für Beiträge

1. Feature-Branch erstellen
2. Änderungen implementieren
3. Lokal prüfen:
   ```bash
   pnpm ok
   ```
4. Commit & Pull Request erstellen
5. CI-Ergebnisse prüfen

## Lizenz

Aktuell ist in diesem Repository keine explizite Lizenzdatei hinterlegt.
Wenn du das Projekt veröffentlichen oder extern nutzen möchtest, ergänze eine passende `LICENSE`.
