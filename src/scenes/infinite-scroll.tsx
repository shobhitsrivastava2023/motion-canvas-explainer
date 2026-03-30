import {parser} from '@lezer/javascript';
import {
  Code,
  Layout,
  LezerHighlighter,
  makeScene2D,
  Rect,
} from '@motion-canvas/2d';
import {all, createRef, easeOutCubic, waitFor} from '@motion-canvas/core';
import {IdeWindow} from '../components/IdeWindow';

const FULL = `console.log("hey there");
console.log("lets discuss infinite scroll");`;

const SOURCE_LINES = FULL.split('\n');

const mono = '"JetBrains Mono", "Cascadia Code", Consolas, monospace';
const jsHighlighter = new LezerHighlighter(
  parser.configure({dialect: 'jsx ts'}),
);

const lineRefs = SOURCE_LINES.map(() => createRef<Code>());

export default makeScene2D(function* (view) {
  view.fill('#000000');

  const shell = createRef<Rect>();

  view.add(
    <Layout
      layout
      width={1920}
      height={1080}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <IdeWindow
        shellRef={shell}
        title={'hey there'}
        subtitle={'JavaScript'}
        shellWidth={1000}
        shellHeight={400}
        shellFill={'#1C1C1C'}
        titleBarFill={'#161616'}
        bodyFill={'#141414'}
        bodyPadding={[24, 28]}
        bodyGap={8}
        opacity={0}
        scale={0.95}
      >
        {SOURCE_LINES.map((line, i) => (
          <Code
            key={`line-${i}`}
            ref={lineRefs[i]}
            code={line}
            opacity={0}
            highlighter={jsHighlighter}
            fontFamily={mono}
            fontSize={24}
            lineHeight={'150%'}
            offset={-1}
            width={'100%'}
          />
        ))}
      </IdeWindow>
    </Layout>,
  );

  yield* all(
    shell().opacity(1, 1.5, easeOutCubic),
    
  );
  yield* waitFor(0.2);

  for (let i = 0; i < lineRefs.length; i++) {
    yield* lineRefs[i]().opacity(1, 0.5, easeOutCubic);
    yield* waitFor(0.7);
  }

  yield* waitFor(2);
});
