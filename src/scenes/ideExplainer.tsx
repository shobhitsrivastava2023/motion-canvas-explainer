import {
  Circle,
  Code,
  Layout,
  LezerHighlighter,
  makeScene2D,
  Rect,
  Txt,
  lines,
} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {parser} from '@lezer/javascript';

/** Default @lezer/javascript parser has JSX/TS off — without this, TSX parses badly and Code renders blank. */
const jsHighlighter = new LezerHighlighter(
  parser.configure({dialect: 'jsx ts'}),
);

const TERM_GREEN = '#3fb950';
const TERM_DIM = '#6e7681';

const NP_CMD = 'npx create-next-app@latest infinit-scroll';

const PAGE_INITIAL = `import Image from "next/image";
import { CardLists } from "./Components/CardList";

export default function Home() {
  return (
   <div className="h-screen w-screen flex flex-col justify-center items-center">
   </div>
  );
}`;

const PAGE_WITH_CARDLIST = `import Image from "next/image";
import { CardLists } from "./Components/CardList";

export default function Home() {
  return (
   <div className="h-screen w-screen flex flex-col justify-center items-center">
   <div className="mt-[300px]">
      <CardLists />
    </div>
   </div>
  );
}`;

const API_CODE = `import { posts } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit")) || 8;

  let startIndex = 0;

  if (cursor) {
    const cursorIndex = posts.findIndex(p => p.id === cursor);
    startIndex = cursorIndex + 1; // start AFTER the cursor post
  }

  const slice = posts.slice(startIndex, startIndex + limit);
  const nextCursor = slice.length === limit ? slice[slice.length - 1].id : null;

  return Response.json({ posts: slice, nextCursor });
}`;

const mono = '"JetBrains Mono", "Cascadia Code", Consolas, monospace';
const uiSans = 'Inter, "Segoe UI", system-ui, sans-serif';

export default makeScene2D(function* (view) {
  view.fill('#000000');

  const shell = createRef<Rect>();
  const titleBar = createRef<Rect>();
  const fileName = createRef<Txt>();
  const terminalPane = createRef<Layout>();
  const editorPane = createRef<Layout>();
  const termCmd = createRef<Txt>();
  const scoop1 = createRef<Txt>();
  const scoop2 = createRef<Txt>();
  const scoop3 = createRef<Txt>();
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
        opacity={0}
        scale={0.97}
        width={1100}
        height={220}
        fill={'#000000'}
        stroke={'#2a2a2a'}
        lineWidth={2}
        radius={10}
        direction={'column'}
        clip
        layout
      >
        <Rect
          ref={titleBar}
          opacity={0}
          height={0}
          fill={'#0d0d0d'}
          stroke={'#1f1f1f'}
          lineWidth={1}
          direction={'row'}
          alignItems={'center'}
          padding={[0, 18]}
          gap={14}
          layout
          clip
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

        {/* layout must stay enabled here: layout=false skips layoutChildren() so child
            divs never mount under the flex tree → getBoundingClientRect is 0 and Code/Txt don't render. */}
        <Rect grow={1} fill={'#000000'} direction={'column'} layout>
          <Layout
            ref={terminalPane}
            grow={1}
            direction={'column'}
            justifyContent={'center'}
            padding={[28, 32]}
            gap={10}
          >
            <Txt
              ref={termCmd}
              fill={TERM_GREEN}
              fontFamily={mono}
              fontSize={26}
              lineHeight={'150%'}
              text={''}
            />
            <Txt
              ref={scoop1}
              opacity={0}
              text={'✓  Creating Next.js app structure…'}
              fill={TERM_DIM}
              fontFamily={mono}
              fontSize={22}
              lineHeight={'150%'}
            />
            <Txt
              ref={scoop2}
              opacity={0}
              text={'✓  Installing dependencies…'}
              fill={TERM_DIM}
              fontFamily={mono}
              fontSize={22}
              lineHeight={'150%'}
            />
            <Txt
              ref={scoop3}
              opacity={0}
              text={'✓  Ready — opening project'}
              fill={TERM_DIM}
              fontFamily={mono}
              fontSize={22}
              lineHeight={'150%'}
            />
          </Layout>

          <Layout
            ref={editorPane}
            grow={0}
            height={0}
            minHeight={0}
            opacity={0}
            padding={[20, 28]}
            direction={'column'}
            layout
          >
            <Code
              ref={codeRef}
              grow={1}
              width={'100%'}
              offset={-1}
              code={PAGE_INITIAL}
              highlighter={jsHighlighter}
              fontFamily={mono}
              fontSize={24}
              lineHeight={'150%'}
            />
          </Layout>
        </Rect>
      </Rect>
    </Layout>,
  );

  const code = codeRef();

  yield* all(
    shell().opacity(1, 0.4),
    shell().scale(1, 0.65, easeOutCubic),
  );

  yield* waitFor(0.15);

  const cmd = NP_CMD;
  for (let i = 0; i <= cmd.length; i++) {
    termCmd().text('$ ' + cmd.slice(0, i));
    yield* waitFor(0.028);
  }

  yield* waitFor(0.2);
  yield* scoop1().opacity(1, 0.22);
  yield* waitFor(0.12);
  yield* scoop2().opacity(1, 0.22);
  yield* waitFor(0.12);
  yield* scoop3().opacity(1, 0.22);
  yield* waitFor(0.45);

  yield* all(
    shell().height(640, 0.85, easeInOutCubic),
    titleBar().height(48, 0.85, easeInOutCubic),
    titleBar().opacity(1, 0.55),
  );

  terminalPane().grow(0);
  terminalPane().height(0);
  terminalPane().minHeight(0);
  terminalPane().padding(0);
  editorPane().grow(1);
  editorPane().height(null);
  editorPane().minHeight(0);

  yield* all(
    terminalPane().opacity(0, 0.35),
    editorPane().opacity(1, 0.45),
  );

  yield* waitFor(0.35);

  yield* code.code(PAGE_WITH_CARDLIST, 1.35, easeInOutCubic);

  yield* waitFor(0.2);

  yield* code.selection(lines(6, 8), 0.5, easeInOutCubic);

  yield* waitFor(1.1);

  yield* code.selection(lines(0, Infinity), 0.35, easeInOutCubic);
  yield* code.opacity(0, 0.42);

  code.code(API_CODE);
  fileName().text('api/getposts/route.ts');

  yield* code.opacity(1, 0.48);

  yield* waitFor(2.2);
});
