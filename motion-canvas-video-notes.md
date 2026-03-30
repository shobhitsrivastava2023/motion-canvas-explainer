# Making animated explainer videos with Motion Canvas

Motion Canvas is **code-first motion graphics**: you describe scenes in TypeScript/TSX, drive time with **generator functions** (`function*`), and use **`yield*`** to run tweens and wait for beats. It feels like a small game engine tuned for **2D, typography, and UI mockups** rather than character animation.

Use this as a checklist of what to focus on so the work stays manageable.

---

## 1. Core mental model (get this solid first)

- **Scenes** are async generators: one frame of logic runs until the next `yield` / `yield*`.
- **Time** advances only when you `yield*` a tween, a `waitFor`, or another thread. Plain `yield` also hands control back. If you “do work” without yielding, you get a jump or a freeze in the editor.
- **Refs** (`createRef`) give you handles to nodes so you can animate them after `view.add(...)`.
- Prefer **one readable timeline** in a single generator: introduce variables for “phases” or extract small `function*` helpers only when a block repeats.

---

## 2. Layout before fancy motion

- Most pain comes from **flex layout** (`Layout`, `Rect` with `direction`, `grow`, `gap`) and **first-frame sizing**. Text and `Code` nodes need a layout pass before sizes are trustworthy.
- If you **measure** something (e.g. `getSelectionBBox`, `computedSize`), do it **after** the UI exists and often after a short `yield*` `waitFor(0)` (or similar) if numbers look wrong on frame one.
- Learn the **enum-like string props** (e.g. `alignItems: 'start'` not `'flex-start'`). TypeScript will guide you, but mismatches are easy when you’re used to CSS.

---

## 3. The `Code` node (syntax, selection, search)

- **Highlighting** needs a real highlighter (e.g. `LezerHighlighter` + a Lezer parser). Without it, you still get text, but not the IDE look you expect.
- **`selection`** controls which ranges are visually emphasized (brighter vs dimmed with the default draw hook). You can tween `code.selection(..., duration, easing)` for smooth focus changes.
- **`findFirstRange` / `findAllRanges`** use `String.prototype.matchAll` under the hood. Any **RegExp must include the `g` flag** (e.g. `/pattern/g`). Plain strings are fine.
- **Line/column math** is easy to get wrong; prefer **`findFirstRange`** when you can so highlights track edits to the snippet.
- Keep **snippets in a `const`** so the same string drives display, search, and story beats.

---

## 4. Coordinate spaces (overlays, arrows, connectors)

- Positions from **`getSelectionBBox`** are in the **`Code` node’s local space**.
- Overlays (lines, circles, callouts) drawn as **siblings of `view`** need **world-consistent** points: transform with something like `point.transformAsPoint(code.localToWorld())` so arrows line up after layout and parent transforms.
- **`zIndex`** (or add order) matters: put connectors **after** the main layout so they paint on top.

---

## 5. Timing, rhythm, and readability

- **Explainer videos** need **breathing room**: short pauses after a reveal (`waitFor`) often matter more than easing curves.
- **Parallel motion** (`all`, `chain` from `@motion-canvas/core`) keeps scenes alive; **sequential** steps clarify causality. Mix them on purpose, not by accident.
- **Easing**: `easeInOutCubic` is a safe default; use snappier eases only when you want energy (e.g. UI snapping into place).
- If you add **voiceover later**, plan **hooks** (named `waitFor` durations or scene cuts) so you can stretch or shrink beats without rewriting everything.

---

## 6. Project and export settings

- **`project.meta`**: resolution (`size`), preview vs render **FPS**, and **background** affect how things feel and export. Decide early (e.g. 1920×1080, 30 vs 60 fps).
- **Fonts**: specify stacks (`JetBrains Mono`, `Inter`, etc.) and test on the machine you **render** on; missing fonts change metrics and break tight layouts.
- **Rendering** is a separate step from the live preview; run a short test export early to catch performance or font issues.

---

## 7. Workflow tips (what makes it less painful)

- **Scrub the timeline** in the editor constantly; treat the generator as a score, not a script you run once.
- **Small scenes** beat one giant file: easier to reorder in `project.ts` and to re-render a single section.
- When something breaks, **bisect**: comment out half the `yield*` chain to see which segment fails (layout, search, transform, tween).
- **Reuse** IDE chrome (window, title bar, tab bar) as a copied subtree or shared component once you’re happy with it.

---

## 8. Common pitfalls (quick reference)

| Issue | What to check |
|--------|----------------|
| `matchAll` / RegExp error | Regex passed to `findFirstRange` / `findAllRanges` needs **`g`**. |
| Wrong highlight position | Snippet changed but **search pattern** didn’t; or **0-based** line/column mix-ups. |
| Arrow/box misaligned | Using **local** bbox coords without **`localToWorld()`** for overlay nodes. |
| Layout looks wrong in first frame | Need a yield / wait for **layout** before measuring. |
| Janky or frozen preview | Heavy work in the generator **without** yielding; or too many simultaneous expensive updates. |

---

## 9. What to study next in the library

- **`Code`**: `code()`, `.selection`, `.findFirstRange`, `getSelectionBBox`.
- **Layout**: `Layout`, `Rect`, flex props, padding/gap.
- **Motion**: `tween`, `waitFor`, `all`, `chain`, signal `.to()` / duration-based setters on nodes.
- **Curves**: `Line`, arrows, stroke styling for connectors and underlines.

---

## Summary

Focus on **generators as timelines**, **layout-then-measure**, **`Code` selection and regex rules**, and **world vs local coordinates** for overlays. Keep scenes **small**, add **pauses for clarity**, and validate **export settings and fonts** early. Motion Canvas rewards the same habits as building UI: structure first, polish second.
