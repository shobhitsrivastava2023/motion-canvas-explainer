# `IdeWindow` (Motion Canvas)
A small reusable **IDE-style window** component (traffic lights + tab title + subtitle + dark body) for explainer animations.

## Where
`src/components/IdeWindow.tsx`

## What it provides
- `shellRef`: reference to the outer `Rect` so you can animate **opacity/scale**.
- `title` / `titleRef`: show and optionally update the tab filename.
- `subtitle`: muted text in the title bar.
- `children`: anything renderable by Motion Canvas (`Txt`, `Code`, `Layout`, etc.) stacked inside the window body.

## Props

| Prop | Type | Notes |
|---|---|---|
| `shellRef` | `ReferenceReceiver<Rect>` | Ref to animate intro (fade/scale). |
| `title` | `string` | Tab text (default: `untitled`). |
| `titleRef` | `ReferenceReceiver<Txt>` | Optional ref if you want to change the title during the animation. |
| `subtitle` | `string` | Right-side title bar text. |
| `shellWidth` | `number` | Outer window width (default: `1000`). |
| `shellHeight` | `number` | Outer window height (default: `480`). |
| `shellFill` | `string` | Outer background fill (default: `#000000`). |
| `shellStroke` | `string` | Outer border color (default: `#2a2a2a`). |
| `shellRadius` | `number` | Corner radius (default: `10`). |
| `trafficLights` | `boolean` | Show mac-style dots (default: `true`). |
| `titleBarHeight` | `number` | Title bar height (default: `48`). |
| `bodyFill` | `string` | Body area fill (default: `#000000`). |
| `bodyPadding` | `PossibleSpacing` | Padding inside the body (default: `[20, 28]`). |
| `bodyGap` | `number` | Gap between stacked children (default: `8`). |
| `clip` | `boolean` | Clip body inside the shell (default: `true`). |
| `opacity` | `SignalValue<number>` | Passed to outer `Rect` (intro control). |
| `scale` | `SignalValue<PossibleVector2 \| number>` | Passed to outer `Rect`. |
| `scaleX`, `scaleY` | `SignalValue<number>` | Passed through to outer `Rect`. |

## Usage notes (important)
- The component keeps the inner body as a **flex layout**, so `Code`/`Txt` measure & render correctly.
- For “intro” animations, set `opacity={0}` and `scale={0.95}` then tween `shellRef()` to bring it in.

## Minimal example (greeting fade-in)
```tsx
import {Code, IdeWindow, makeScene2D, Txt} from '@motion-canvas/2d';
import {all, createRef, easeOutCubic, waitFor} from '@motion-canvas/core';
import {Rect} from '@motion-canvas/2d';
import {createRef as mcCreateRef} from '@motion-canvas/core';

import {IdeWindow as IdeWindowComponent} from '../components/IdeWindow'; // adjust path if needed
// If your TS config supports it, you can import directly:
// import {IdeWindow} from '../components/IdeWindow';

export default makeScene2D(function* (view) {
  view.fill('#000');

  const shell = createRef<Rect>();

  view.add(
    <IdeWindowComponent
      shellRef={shell}
      title="greeting.js"
      subtitle="JavaScript"
      shellWidth={1000}
      shellHeight={400}
      opacity={0}
      scale={0.95}
    >
      <Txt
        text={'console.log("hey there")'}
        fill={'#FFFFFF'}
        fontSize={40}
        fontFamily={'"JetBrains Mono", Consolas, monospace'}
      />
    </IdeWindowComponent>,
  );

  yield* all(
    shell().opacity(1, 0.5, easeOutCubic),
    shell().scale(1, 0.5, easeOutCubic),
  );

  yield* waitFor(1);
});

const snippet = `export default function Home() { return null; }`;

// ...
<IdeWindowComponent shellRef={shell} title="page.tsx" subtitle="Next.js" opacity={0} scale={0.95}>
  <Code
    code={snippet}
    highlighter={tsxHighlighter}
    fontFamily={'"JetBrains Mono", Consolas, monospace'}
    fontSize={24}
    lineHeight={'150%'}
    width={'100%'}
    grow={1}
    offset={-1}
  />
</IdeWindowComponent>