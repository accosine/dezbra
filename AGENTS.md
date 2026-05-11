# Code-Richtlinien

## Best Practices für die Implementierung

### 0 — Zweck

Diese Regeln gewährleisten Wartbarkeit, Sicherheit und die Entwicklungsgeschwindigkeit.
**MUSS**-Regeln werden durch die CI erzwungen; **SOLLTE**-Regeln werden dringend empfohlen.

---

### 1 — Vor dem Programmieren

- **BP-1 (MUSS)** Stelle dem Benutzer klärende Fragen.
- **BP-2 (SOLLTE)** Entwerfe und bestätige einen Lösungsansatz für komplexe Aufgaben. Ziehe bei nicht-trivialen Features die `sdte-loop`-Methode hinzu.
- **BP-3 (SOLLTE)** Falls ≥ 2 Lösungsansätze existieren, liste klare Vor- und Nachteile auf.

---

### 2 — Während des Programmierens

- **C-1 (MUSS)** Befolge TDD: Stub erstellen -> fehlschlagenden Test schreiben -> implementieren.
- **C-2 (MUSS)** Benenne Funktionen unter Verwendung des bestehenden Domänenvokabulars, um Konsistenz zu gewährleisten.
- **C-3 (SOLLTE)** Bevorzuge einfache und testbare Funktionen.
- **C-4 (MUSS)** Bevorzuge „Branded Types“ (`type` mit Typ-Tag) für IDs.

```ts
type UserId = Brand<string, "UserId">; // ✅ Gut
type UserId = string; // ❌ Schlecht
```

- **C-5 (MUSS)** Verwende `import type { … }` für reine Typ-Importe.
- **C-6 (SOLLTE NICHT)** Füge Kommentare hinzu, außer bei kritischen Besonderheiten; verlasse dich auf selbsterklärenden Code.
- **C-7 (SOLLTE)** Verwende standardmäßig `type`; nutze `interface` nur, wenn dies die Lesbarkeit erhöht oder ein „Interface Merging“ erforderlich ist.
- **C-8 (SOLLTE NICHT)** Lagere keine neue Funktion aus, es sei denn, sie wird an anderer Stelle wiederverwendet, ist die einzige Möglichkeit, ansonsten untestbare Logik per Unit-Test zu prüfen, oder verbessert die Lesbarkeit eines unübersichtlichen Codeblocks drastisch.
- **C-9 (SOLLTE)** Benenne Elemente nach ihrer Art: Funktionen verwenden Verben (`updatePlayer`, `clamp`), Variablen/Typen verwenden Substantive (`GameState`, `enemies`), Booleans verwenden Prädikate (`isActive`, `playerMoved`). -
- **C-10 (SOLLTE NICHT)** Verwende keine booleschen Parameter, um das Verhalten einer Funktion zu steuern – teile diese stattdessen in zwei explizite Funktionen auf.
- **C-11 (SOLLTE NICHT)** Weise Funktionsparametern keine neuen Werte zu. Behandle jeden Parameter als `const`.
- **C-12 (SOLLTE NICHT)** Verwende keine vagen Namen wie `data`, `item`, `thing`, `info`, `value`, `obj` oder `result`. Bevorzuge aussagekräftige Namen, die die Absicht offenbaren (`userList`, `pendingActions`, `parsedInput`) – Anti-Pattern „Bedeutungslose Namen“.
- **C-13 (SOLLTE NICHT)** Verwende keine Abkürzungen, die über etablierte Akronyme (DOM, URL, HTTP, ID) hinausgehen. `usrLst` ist falsch; `userList` ist richtig – Anti-Pattern „Rauschwörter“.
- **C-14 (SOLLTE NICHT)** Verschachtle Kontrollstrukturen nicht tiefer als drei Ebenen (sogenannter „Arrow Code“). Vereinfache die Struktur durch vorzeitige Rückgaben (Early Returns), ausgelagerte Prädikate oder die Komposition mittels `pipe()`.
- **C-15 (MUSS)** Gebe Werte explizit zurück. Jede Funktion deklariert ihren Rückgabetyp; implizite Rückgaben von `undefined` sind untersagt. Eine Funktion, die legitimerweise nichts zurückgibt, gibt `void` zurück.
- **C-16 (SOLLTE NICHT)** Deklarieren Sie keinen veränderlichen Zustand (mutable state) auf Modulebene. Module exportieren ausschließlich `const`-Bindungen und reine Funktionen – keine Neuzuweisungen mittels `let` auf oberster Ebene, kein `var` und keine exportierten veränderlichen Objekte. Ein gemeinsam genutzter veränderlicher Zustand gehört in das `GameState` (gemäß Regel A-6). Ein lokales `let` innerhalb einer einzelnen Funktion, das als Akkumulator dient, ist akzeptabel; jedoch ist die Verwendung von `.reduce()` meist die klarere Lösung.

### 3 — Code-Organisation

- **O-1 (MUST)** Place code in `utils` if reusable, domain agnostic logic.
- **O-2 (SOLLTE)** Inkrementeller Fortschritt statt „Big Bangs“ – kleine Änderungen, die kompilieren und die Tests bestehen.
- **O-3 (SOLLTE)** Aus bestehendem Code lernen – studiere und plane, bevor du implementierst.
- **O-4 (SOLLTE)** Pragmatisch statt dogmatisch – passe dich der Projektrealität an.
- **O-5 (MUSS)** Klare Absicht statt „cleverem“ Code – sei langweilig und offensichtlich.
- **O-6 (MUSS)** Eine einzige Verantwortung pro Funktion/Klasse.
- **O-7 (MUSS)** Vermeide verfrühte Abstraktionen.
- **O-8 (MUSS)** Wenn es erklärt werden muss, ist es zu komplex.
- **O-9 (MUSS)** DRY — beseitige Duplizierungen durch Abstraktion, sobald dieselbe Logik an drei Stellen auftaucht (Regel der Drei). Zwei nahezu identische Blöcke dürfen bestehen bleiben, bis ein dritter das Muster bestätigt.
- **O-10 (MUSS)** KISS — wähle den langweiligen, offensichtlichen Ansatz. „Cleverness“ ist ein Mangel; wenn jemand fragen muss: „Warum ist das so?“, vereinfache es.
- **O-11 (SOLLTE)** Halte Dateien ≤ ~200 Zeilen (Prinzip der kleinen Dateien). Dateien, die größer sind, verbergen fast immer eine fehlende Modulgrenze.
- **O-12 (MUSS)** Eine Verantwortung pro Datei (erweitert O-5 von der Funktionsebene auf die Dateiebene). Der Dateiname ist ein Vertrag – wenn kein präziser Name gewählt werden kann, erledigt die Datei zu viel.

### 4 - Test-Konventionen

- **AR-1 (MUSS)** E2E-Tests verwenden die Dateiendung `*.spec.ts` und werden mittels Playwright ausgeführt (nicht Vitest). Dies stellt eine Umkehrung der universellen Konvention `*.test.ts` dar, die an anderer Stelle Anwendung findet.
- **AR-2 (MUSS)** Die Tests werden über Desktop- (Chromium / Firefox / WebKit) sowie mobile Viewports (Pixel 5 Chrome, iPhone 12 Safari) hinweg ausgeführt. Neue Tests müssen in allen fünf Umgebungen erfolgreich durchlaufen.

#### Codequalität

- **Jeder Commit muss**:
  - Erfolgreich kompilieren
  - Alle bestehenden Tests bestehen
  - Tests für neue Funktionalitäten enthalten
  - Den Formatierungs-/Linting-Regeln des Projekts folgen

- **Vor dem Commit**:
  - Die Änderungen selbst überprüfen (Self-Review)
  - Sicherstellen, dass die Commit-Nachricht das „Warum“ erklärt
  - Vor dem Commit „pnpm run ok“ ausführen

##### TypeScript und Typisierung

- Niemals Typ-Assertions (Typbehauptungen) in generiertem Code einführen.
- Bestehende Typumwandlungen (Casts) in sichere Alternativen umwandeln (Refactoring).
- Falls eine Typumwandlung unvermeidlich erscheint, zunächst Typ-Guards oder Generics bevorzugen.
- Falls dennoch erforderlich, eine explizite Unterdrückung mit Begründung hinzufügen.
- Alle Typen in TypeScript-Dateien müssen unter Verwendung von TSDoc-Annotationen dokumentiert werden.

###### Wichtige Regeln

TypeScript:

1.  **Sei explizit**: Gib Typen für alle Funktionsparameter und Rückgabewerte an.
2.  **Verbiete Typumwandlungen (Casting)**: Vermeide jegliche Typ-Assertions (`as` und `<Type>`) im TypeScript-Code. Behandle Typumwandlungen als Fehler, sofern sie nicht explizit begründet sind.
3.  **Erlaubte Muster (als Ersatz für Typumwandlungen)**:

- Typ-Einschränkung (Type Narrowing: `typeof`, `in`, diskriminierte Unions)
- Benutzerdefinierte Typ-Guards (`obj is T`)
- `satisfies`-Operator (bevorzugt gegenüber Assertions)
- Korrekte Verwendung von Generics anstelle des Erzwingens von Typen

4. **Nicht erlaubte Muster**:

- `value as Type`
- `<Type>value`
- Umwandlung von `any` oder `unknown` ohne vorherige Validierung
- Der Typ `any` ist strengstens verboten. Falls ein Typ tatsächlich unbekannt ist, verwende `unknown` und führe die notwendigen Typüberprüfungen durch.

5. **Ausnahmen für Typen**: Nur erlaubt mit expliziter Unterdrückung des Linters und entsprechender Begründung:

```ts
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- <Begründung>
```

6. **Erzwinge `Readonly` bei geteilten Typen**: Verwende `Readonly<T>` und `ReadonlyArray<T>` (oder die entsprechenden `readonly`-Modifikatoren) für jeden Typ, der durch den State, Props oder eine öffentliche API fließt. Der Compiler erzwingt die Unveränderlichkeit (Immutability) auf Typebene; zusätzlich muss sie auch zur Laufzeit sichergestellt werden. Beides ist erforderlich.

   ````ts
   type GameState = Readonly<{
     player: Readonly<Player>;
     enemies: ReadonlyArray<Enemy>;
   }>;
   ``` ```;
   ````

### 4 — Tooling-Gates

- **G-1 (MUSS)** `pnpm run format` läuft erfolgreich durch.
- **G-2 (MUSS)** `pnpm run lint` läuft erfolgreich durch.
- **G-3 (MUSS)** `pnpm run test` läuft erfolgreich durch.
- **G-4 (MUSS)** `pnpm run typecheck` läuft erfolgreich durch.
- **G-5 (MUSS)** `pnpm run build` läuft erfolgreich durch.

### 5 – Git

- **GH-1 (MUSS)** Verwende beim Verfassen von Commit-Nachrichten das Format der „Conventional Commits“: https://www.conventionalcommits.org/en/v1.0.0
- **GH-2 (SOLLTE NICHT)** Verweise in Commit-Nachrichten auf Gemini, Google, Claude oder Anthropic.

### 6 – Wichtige Erinnerungen

**NIEMALS**:

- Verwende `--no-verify`, um Commit-Hooks zu umgehen.
- Deaktiviere Tests, anstatt sie zu reparieren.
- Committe Code, der nicht kompiliert.
- Stelle Vermutungen an – verifiziere stattdessen anhand des bestehenden Codes.

**IMMER**:

- Committe funktionierenden Code inkrementell.
- Aktualisiere die Planungsdokumentation fortlaufend.
- Lerne aus bestehenden Implementierungen.
- Brich nach 3 fehlgeschlagenen Versuchen ab und nimm eine Neubewertung vor.

### 8 – Tests

Die Testregeln ergänzen die Kompetenz „write-tests“ (welche Dateikonventionen und den Stil von Assertions abdeckt). Die Regeln in diesem Abschnitt sind unverhandelbare Eigenschaften, die jeder Test erfüllen muss.

- **T-1 (MUSS)** Tests folgen den **FIRST-Prinzipien**. Das Fehlen eines dieser Prinzipien gilt als Mangel:
  - **F**ast (Schnell) – läuft in Millisekunden ab; langsame Tests werden übersprungen und veralten.
  - **I**ndependent (Unabhängig) – kein geteilter Zustand, keine Abhängigkeit von der Ausführungsreihenfolge. Jeder Test läuft isoliert ab.
  - **R**epeatable (Wiederholbar) – deterministisch. Gleiche Eingabe, gleiches Ergebnis – auf jeder Maschine, bei jedem Durchlauf.
  - **S**elf-validating (Selbstvalidierend) – liefert ein binäres „Bestanden/Nicht bestanden“-Ergebnis, ohne dass eine manuelle Überprüfung der Ausgabe durch einen Menschen erforderlich ist.
  - **T**imely (Rechtzeitig) – wird parallel zum (oder – gemäß C-1 – vor dem) zu testenden Code geschrieben und niemals nachträglich angeflanscht.
- **T-2 (SOLLTE)** Die Testkörper verwenden die Struktur **Given–When–Then** (oder entsprechende Kommentare wie `// arrange`, `// act`, `// assert`), damit der Leser Einrichtung, Aktion und Erwartung auf einen Blick erfassen kann.
- **T-3 (MUSS)** **Black-Box-Testing** – Überprüfe (Assert) ausschließlich das beobachtbare Verhalten über die öffentliche API. Greife niemals in die private Implementierung, die interne Struktur des Zustands oder die Anzahl der Funktionsaufrufe ein. Eine refaktorierende Umgestaltung, die das Verhalten des Codes unverändert lässt, darf keine Anpassungen an den Tests erfordern.
