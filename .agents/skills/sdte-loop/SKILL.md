---
name: sdte-loop
description: "Führe den Spec → Design → Tasks → Execution-Workflow für nicht-triviale Arbeiten aus — erzeugt /specs/<feature>/{spec,design,tasks}.md, steürt atomare Ausführung pro Aufgabe und endet mit einer Review-Phase. Nutze dies beim Start eines neün Pakets, eines neün Spielsystems, einer GameState-Formänderung oder jeder änderung, die > 3 Dateien berührt oder eine Schichtgrenze überschreitet."
---

# Spec → Design → Tasks → Execution (SDTE) Loop

Ein reiner Markdown-Workflow für nicht-triviale Arbeiten. Jedes Multi-Datei-Feature durchläuft vier aufeinanderfolgende Phasen — **Spec**, **Design**, **Tasks**, **Execution** — plus eine abschliessende **Review**. Alle Artefakte liegen in `/specs/<feature-name>/` innerhalb des Repositories und werden zusammen mit dem Code committet, damit der Workflow vollständig Git-nativ und auditierbar ist.

## Wann SDTE gilt

- **S-1 (MUSS)** Verwende SDTE für jede Arbeit, die ein neüs Paket einführt, ein neüs Spielsystem einführt (z. B. Kampf, FOV, Inventar), die Form von `GameState` oder `stateVersion` ändert, mehr als drei Qülldateien berührt oder eine Schichtgrenze überschreitet.
- **S-2 (SOLLTE NICHT)** Verwende SDTE für triviale Arbeiten: Tippfehlerkorrekturen, Dependency-Bumps, Single-File-Refactorings, Formatierungsdurchläufe.
- **S-3 (MUSS)** Wenn SDTE gilt, beginne nicht mit der Implementierung, bis `tasks.md` existiert und mindestens eine atomare Aufgabe ausführungsbereit ist.

## Artefakte

Jedes Feature besitzt einen Ordner `/specs/<kebab-feature-name>/` mit folgendem Inhalt:

| Datei            | Erforderlich | Zweck                                                                               |
| ---------------- | ------------ | ----------------------------------------------------------------------------------- |
| `spec.md`        | ja           | Was gebaut wird und warum. Der Intent-Vertrag.                                      |
| `design.md`      | ja           | Wie es gebaut wird. Architektur, Tradeoffs, Schichtzuordnung.                       |
| `tasks.md`       | ja           | Atomare, unabhängig ausführbare Schritte als Checkbox-Liste.                        |
| `constraints.md` | optional     | Nicht verhandelbare Vorgaben — Performance-Budgets, API-Grenzen, Dependency-Limits. |
| `acceptance.md`  | optional     | Verifizierbare Akzeptanzkriterien mit konkreten Beispielen oder Testfällen.         |

- **S-4 (MUSS)** Alle Artefakte werden während der Arbeit ins Repository committet — sie sind Teil des Lieferumfangs, keine Wegwerfnotizen.
- **S-5 (MUSS)** Alle Dateien sind reines Markdown, ohne YAML-Frontmatter.
- **S-6 (SOLLTE)** Füge `constraints.md` hinzu, wenn Performance-, Dependency- oder API-Form-Regeln für das Feature gelten; füge `acceptance.md` hinzu, wenn die Spec als konkrete Beispiele testbar ist.

## Spec-Phase (das _Was & Warum_)

`spec.md` beantwortet, was gebaut wird und warum. Sie muss enthalten:

- **Ziel** — ein Absatz, der das für Benutzer sichtbare Ergebnis beschreibt.
- **Benutzer-sichtbares Verhalten** — Bullet-Liste beobachtbarer änderungen.
- **Ausserhalb des Scopes** — explizite Nicht-Ziele, um Drift zu verhindern.
- **Offene Fragen** — alles Unklare; alle Fragen werden vor Beginn des Designs geklärt.
- **Edge Cases** — Grenzbedingungen, Fehlerzustände, ungewöhnliche Eingaben.

Workflow:

- **S-7 (MUSS)** Lies die Spec wie ein neür Leser und decke jede Mehrdeutigkeit, fehlende Vorgabe oder nicht behandelten Edge Case auf. Kläre jeden Punkt durch direkte Bearbeitung von `spec.md` — übernimm niemals eine offene Frage in die Design-Phase.
- **S-8 (SOLLTE NICHT)** Triff keine Implementierungsentscheidungen in `spec.md`; diese gehören in `design.md`. Wenn du Datenstrukturen oder Funktionssignaturen beschreibst, bist du in Design-Territorium gewechselt.

## Design-Phase (das _Wie_)

`design.md` beantwortet, wie die Spec implementiert wird. Sie muss enthalten:

- **Schichtzuordnung** für jedes neü Modul (gemäss den Schichtregeln des Pakets).
- **öffentliche API-Oberfläche** — Funktionssignaturen, Typen, exportierte Namen.
- **änderungen der Datenform** — `GameState`-Deltas, neü Action-Varianten, Branded-ID-Typen.
- **Tradeoffs** — gewählter Ansatz plus mindestens eine betrachtete Alternative mit Begründung.
- **Reuse Map** — bestehende Funktionen und Module, die genutzt werden sollen, referenziert per Dateipfad.

Workflow:

- **S-9 (MUSS)** Jede Architekturentscheidung listet mindestens eine betrachtete Alternative auf (BP-3 auf Design-Ebene angewendet).
- **S-10 (MUSS)** Referenziere bestehende Funktionen und Module per Dateipfad, damit Wiederverwendung explizit ist (verstärkt O-3).
- **S-11 (SOLLTE)** Füge ein kleines ASCII-Diagramm oder eine Tabelle inline ein, wenn mehr als zwei Module zusammenarbeiten; Leser müssen den Datenfluss erkennen können, ohne mehrere Dateien zu öffnen.
- **S-12 (MUSS)** Das Design muss die Schichtregeln des Pakets respektieren. Wenn ein Feature eine Aufwärtsabhängigkeit zu brauchen scheint, ist das Design falsch — korrigiere das Design, nicht die Regeln.

## Aufgabenzerlegung (die _atomaren Schritte_)

`tasks.md` ist eine geordnete Checkbox-Liste atomarer, unabhängig ausführbarer Schritte.

Format:

```md
- [ ] T1 — Füge den Branded Type `Direction` zu `core/types.ts` hinzu
- [ ] T2 — Implementiere den Reducer `moveEntity(state, action)` in `state/move.ts`
- [ ] T3 — Füge Unit-Tests für `moveEntity` hinzu, die Boundary-Clamping abdecken
- [ ] T4 — Verdrahte die Variante `MOVE_ENTITY` in die Root-Pipeline in `effects/loop.ts`
```

Regeln:

- **S-13 (MUSS)** Jede Aufgabe ist klein genug, um eigenständig zu kompilieren, zu linten und zu testen.
- **S-14 (MUSS)** Aufgaben verwenden imperative Verben ("Füge hinzu", "Implementiere", "Verdrahte", "Refaktoriere"), niemals vage Substantive.
- **S-15 (MUSS)** Jede Aufgabe nennt die Datei(en), die sie berührt oder erstellt, damit der Scope eindeutig ist.
- **S-16 (SOLLTE NICHT)** Bündele "Implementierung + Test" nicht in einer Aufgabe — trenne beides, damit Testfehler laut fehlschlagen und der Diff minimal bleibt.
- **S-17 (MUSS)** Lehne jede Aufgabe ab, deren Name "system", "feature" oder "support" enthält — das sind Projekt-Level-Beschreibungen, keine atomaren Schritte. Zerlege weiter.
- **S-18 (MUSS)** Aufgaben werden fortlaufend nummeriert (T1, T2, …), damit sie in Commits und PR-Beschreibungen referenziert werden können.

## Execution-Loop

Die Ausführungsregel ist ein Satz, der wiederholt wird, bis alles erledigt ist:

> **Führe die nächste nicht abgehakte Aufgabe in `tasks.md` aus. Markiere sie erst dann als erledigt (`[x]`), wenn der Code kompiliert, die Tests bestehen und die änderung gestaged ist. Aktualisiere `tasks.md` im selben Commit.**

Regeln:

- **S-19 (MUSS)** Wähle die oberste nicht abgehakte Aufgabe. Sortiere nicht mitten in der Arbeit um.
- **S-20 (MUSS)** Jede ausgeführte Aufgabe endet mit einem grünen `pnpm run ok` für die betroffenen Pakete, bevor sie abgehakt wird.
- **S-21 (MUSS)** Wenn eine Aufgabe eine fehlende oder falsche Designentscheidung aufdeckt, stoppe, bearbeite `design.md` und `tasks.md` entsprechend dem neün Verständnis und fahre dann fort — weite den Scope niemals stillschweigend aus.
- **S-22 (MUSS)** Markiere Aufgaben im selben Commit mit `[x]`, der sie implementiert. Nicht abgehakte erledigte Arbeit gilt als nicht erledigt; abgehakte, aber nicht committete Arbeit ist eine Lüge.
- **S-23 (SOLLTE)** Verwende einen Conventional Commit pro Aufgabe (gemäss GH-1). Referenziere die Task-ID im Commit-Body, z. B. `Implements T2`.

## Review-Phase

Nachdem jede Aufgabe abgehakt ist:

- **S-24 (MUSS)** Gehe `spec.md` (und `acceptance.md`, falls vorhanden) durch und verifiziere, dass jedes Verhalten tatsächlich implementiert ist. Füge einen Abschnitt `## Verification` an `spec.md` an, der festhält, wie jede Anforderung getestet wurde.
- **S-25 (MUSS)** Gleiche Drift ab: Wenn `design.md` die Implementierung nicht mehr beschreibt, aktualisiere sie, bevor das Feature geschlossen wird.
- **S-26 (SOLLTE)** öffne den PR mit einer Ein-Absatz-Zusammenfassung, die auf `/specs/<feature-name>/spec.md` verweist, damit Reviewer mit demselben Kontext starten.

## Anti-Patterns

- **Grobe Aufgaben** — "Authentifizierung baün" ist ein Feature, keine Aufgabe. Zerlege, bis jedes Element isoliert verifizierbar ist.
- **Unpräzise Spec** — vage Specs führen dazu, dass Codex Lücken mit Annahmen füllt, manchmal falsch. Schärfe die Spec, bis Mehrdeutigkeiten als explizite offene Fragen sichtbar werden, und kläre sie vor dem Fortfahren.
- **übersprungene Abschlussverfolgung** — `tasks.md` ist die Source of Truth. Wenn sie der Realität widerspricht (Arbeit erledigt, aber nicht abgehakt; oder abgehakt, aber nicht committet), ist der Workflow gescheitert und der Lauf nicht auditierbar.
- **Acceptance nachträglich geschrieben** — `acceptance.md`, die _nach_ der Implementierung geschrieben wird, ist Theater. Schreibe sie während Spec oder Design, solange die Anforderungen frisch sind.
- **Big-Bang-Ausführung** — viele Aufgaben in einem Commit zu erledigen zerstört den Audit-Trail und macht es schwer, eine einzelne Aufgabe zurückzunehmen, ohne alle zurückzunehmen. Eine Aufgabe = ein verifizierbarer Commit.
