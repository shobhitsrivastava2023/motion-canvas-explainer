# Motion Canvas — animation & scene syntax

Quick reference for **Motion Canvas 3.x** (with `@motion-canvas/2d` + `@motion-canvas/core`).  
Import paths: `@motion-canvas/2d`, `@motion-canvas/core`.

---

## Project & scene entry

```ts
// project.ts
import {makeProject} from '@motion-canvas/core';
import myScene from './scenes/myScene?scene';

export default makeProject({ scenes: [myScene] });
```

```tsx
// myScene.tsx
import {makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#111');
  // ...
});
```

---

## Time & threading (`@motion-canvas/core`)

| Syntax | Meaning |
|--------|---------|
| `function* (view) { ... }` | Scene runner: a **generator**; each `yield*` advances the timeline. |
| `yield* tweenOrWait` | **Wait** until this animation / helper finishes. |
| `yield` (bare) | Yield control (one frame / scheduler step); use sparingly. |
| `yield* waitFor(seconds)` | Pause for **N** seconds. |
| `yield* all(a, b, c)` | Run generators **in parallel**; ends when all finish. |
| `yield* chain(a, b, c)` | Run **one after another** (sequential). |

```ts
import {waitFor, all, easeInOutCubic, easeOutCubic} from '@motion-canvas/core';

yield* waitFor(0.5);
yield* all(
  node().opacity(1, 0.4),
  node().scale(1, 0.6, easeOutCubic),
);
```

**Common easings:** `linear`, `easeInOutCubic`, `easeOutCubic`, `easeInCubic`, etc. (import from core).

---

## Refs & nodes

```ts
import {createRef} from '@motion-canvas/core';
import {Rect, Circle, Txt, Layout, Code, Line} from '@motion-canvas/2d';

const box = createRef<Rect>();
view.add(<Rect ref={box} width={400} height={200} fill="#333" />);

yield* box().opacity(0, 0.3).to(1, 0.4);  // compound example pattern
// Often: yield* box().opacity(1, 0.5);
```

**Pattern:** many signals support **`signal(target, duration, timingFunction?)`** and **`yield*`** that call.

---

## Common node animations (signals)

Examples (exact API can vary slightly by node; use TypeScript hints):

```ts
yield* node().opacity(1, 0.4);
yield* node().scale(1.2, 0.5);
yield* node().scale([sx, sy], duration, easing);
yield* node().position([x, y], 0.6);
yield* node().rotation(45, 1, easing);
yield* node().x(100, 0.3);
```

**Layout / size (Layout/Curve family):**

```ts
node().height(400, 0.8);
node().width('100%');
node().grow(1);
node().height(null);   // often “auto” / unset in layout terms
```

---

## Layout (flex) essentials (`@motion-canvas/2d`)

```tsx
<Layout
  layout
  width={1920}
  height={1080}
  direction={'column'}
  alignItems={'center'}
  justifyContent={'center'}
  gap={16}
>
  <Rect grow={1} fill="#000" layout direction={'column'}>
    ...
  </Rect>
</Layout>
```

**Tips**

- **`layout`** on a parent: children participate in flex + DOM measurement.
- **`grow={1}`**: take free space along main axis.
- **`direction`:** `'row'` | `'column'` (and variants — follow TS types).
- **`alignItems` / `justifyContent`:** use Motion Canvas strings (`'start'`, `'center'`, …), not always CSS names like `flex-start`.

---

## `Code` block (syntax + edits)

```tsx
import {Code, LezerHighlighter, lines, word} from '@motion-canvas/2d';
import {parser} from '@lezer/javascript';

const highlighter = new LezerHighlighter(
  parser.configure({ dialect: 'jsx ts' }),  // TS / TSX + JSX
);

<Code
  ref={codeRef}
  offset={-1}
  grow={1}
  width={'100%'}
  code={START_SNIPPET}
  highlighter={highlighter}
  fontFamily="monospace"
  fontSize={24}
/>
```

| Action | Example |
|--------|---------|
| Morph / replace code | `yield* code().code(NEW_STRING, duration, easeInOutCubic)` |
| Highlight lines | `yield* code().selection(lines(from, to), 0.5, easeInOutCubic)` |
| Highlight a word | `word(line, column, length?)` |
| Find range | `code().findFirstRange('substr')` or **`/regex/g`** (**must use `g`** for RegExp) |

```ts
import {lines} from '@motion-canvas/2d';

yield* code().selection(lines(2, 5), 0.4, easeInOutCubic);
const r = code().findFirstRange(/foo/g);
```

**Selection / dimming:** default draw hook dims non-selected tokens; full file bright: `lines(0, Infinity)`.

---

## TSX in strings + parser

- Enable **`jsx`** (and **`ts`** if you use types) on the Lezer parser:  
  `parser.configure({ dialect: 'jsx ts' })`
- Without dialect, **TSX can fail to parse** and `Code` may appear **blank**.

---

## Coordinate tips (overlays)

```ts
const m = codeNode.localToWorld();
const pt = bbox.center.transformAsPoint(m);
```

Use world-consistent points when drawing **`Line`** / arrows vs `Code` that lives inside nested layouts.

---

## Vite scene import

```ts
import scene from './scenes/foo?scene';
```

The **`?scene`** suffix is required for Motion Canvas’s Vite plugin.

---

## Minimal scene skeleton

```tsx
import {makeScene2D, Rect} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#000');
  const r = createRef<Rect>();
  view.add(<Rect ref={r} size={200} fill="#0af" />);

  yield* r().opacity(0, 0.01).to(1, 0.5);  // fade in (pattern depends on node API)
  yield* waitFor(1);
});
```

*(Prefer your editor’s autocomplete for `Rect`/`Circle` compound signals vs simple signals.)*

---

## Code highlighter template (copy-paste)

Install the Lezer JavaScript grammar (Motion Canvas does not ship it in your app by default):

```bash
npm install @lezer/javascript
```

### Imports + highlighter instances

```ts
import {LezerHighlighter} from '@motion-canvas/2d';
// Optional: import { DefaultHighlightStyle } from '@motion-canvas/2d';
import {parser} from '@lezer/javascript';

/** Plain JavaScript snippets (no JSX, no types). */
export const highlighterJs = new LezerHighlighter(parser);

/** JSX only (components in code, no `Request` / `: type` etc.). */
export const highlighterJsx = new LezerHighlighter(
  parser.configure({ dialect: 'jsx' }),
);

/** JSX + TypeScript — use for TSX, Next.js, typed API routes, etc. */
export const highlighterTsx = new LezerHighlighter(
  parser.configure({ dialect: 'jsx ts' }),
);
```

- **`dialect: 'jsx ts'`** — safest default for **React/Next**-style strings; without it, **TSX often parses wrong** and `Code` can render **blank**.
- **`LezerHighlighter`’s second argument** is optional: omit it to use Motion Canvas’s **Nord-like** `DefaultHighlightStyle`, or pass a CodeMirror **`HighlightStyle`** for a custom theme.

### Use on the `Code` node

```tsx
<Code
  ref={codeRef}
  highlighter={highlighterTsx}
  code={MY_SNIPPET}
  /* …font, size, grow, width — see § Code block */
/>
```

### No syntax highlighter (quick test)

```tsx
<Code code={`console.log('hi');`} highlighter={null} />
```

Tokens still draw; you lose language-aware colors until you wire a highlighter.

---

## IDE window template (copy-paste)

Minimal **VS Code–style** window: rounded shell, mac-style dots, title bar with **editable filename**, dark body, **`Code`** fills the pane.

**Critical:** the **body** `Rect` that wraps `Code` / `Txt` must keep **`layout`** enabled (default flex). **`layout={false}`** on that parent can prevent child layout divs from attaching → **empty editor** (zero measured size).

```tsx
import {
  Circle,
  Code,
  Layout,
  LezerHighlighter,
  makeScene2D,
  Rect,
  Txt,
} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {parser} from '@lezer/javascript';

const mono = '"JetBrains Mono", "Cascadia Code", Consolas, monospace';
const uiSans = 'Inter, "Segoe UI", system-ui, sans-serif';

const tsxHighlighter = new LezerHighlighter(
  parser.configure({ dialect: 'jsx ts' }),
);

const MY_SNIPPET = `export default function Home() {
  return <main>Hello</main>;
}`;

export default makeScene2D(function* (view) {
  view.fill('#000000');

  const shell = createRef<Rect>();
  const fileName = createRef<Txt>();
  const codeRef = createRef<Code>();

  view.add(
    <Layout
      layout
      width={1920}
      height={1080}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Rect
        ref={shell}
        width={960}
        height={540}
        fill={'#000000'}
        stroke={'#2a2a2a'}
        lineWidth={2}
        radius={12}
        direction={'column'}
        clip
        layout
      >
        {/* Title bar */}
        <Rect
          height={48}
          fill={'#0d0d0d'}
          stroke={'#1f1f1f'}
          lineWidth={1}
          direction={'row'}
          alignItems={'center'}
          padding={[0, 18]}
          gap={14}
          layout
        >
          <Layout layout direction={'row'} gap={8} alignItems={'center'}>
            <Circle size={11} fill={'#ff5f56'} />
            <Circle size={11} fill={'#ffbd2e'} />
            <Circle size={11} fill={'#27c93f'} />
          </Layout>
          <Txt
            ref={fileName}
            text={'page.tsx'}
            fill={'#e6edf3'}
            fontFamily={uiSans}
            fontSize={20}
            fontWeight={500}
          />
          <Layout layout grow={1} />
          <Txt
            text={'Next.js'}
            fill={'#6e7681'}
            fontFamily={uiSans}
            fontSize={17}
          />
        </Rect>

        {/* Body — layout MUST stay on for Code/Txt to measure and draw */}
        <Rect grow={1} fill={'#000000'} direction={'column'} layout>
          <Layout layout grow={1} direction={'column'} padding={[20, 28]}>
            <Code
              ref={codeRef}
              grow={1}
              width={'100%'}
              offset={-1}
              code={MY_SNIPPET}
              highlighter={tsxHighlighter}
              fontFamily={mono}
              fontSize={24}
              lineHeight={'150%'}
            />
          </Layout>
        </Rect>
      </Rect>
    </Layout>,
  );

  // Example: rename tab during the video
  // fileName().text('api/route.ts');

  yield* waitFor(1);
});
```

### Optional: terminal + editor in the same window

Use **two** `Layout` siblings inside the body `Rect` (both under a **`layout` `direction={'column'}`** parent):

1. **Terminal** — `grow={1}`, monospace `Txt`, green/dim colors.
2. **Editor** — `grow={0}`, `height={0}`, `opacity={0}` until you “open” the file.

When switching: set **`terminalPane().grow(0); terminalPane().height(0);`**, then **`editorPane().grow(1); editorPane().height(null);`**, then crossfade **`opacity`**. (Same pattern as `ideExplainer.tsx` in this repo.)

---

## Official docs

https://motioncanvas.io/docs/

---

*Generated for local reference — Motion Canvas API may vary slightly by version.*
