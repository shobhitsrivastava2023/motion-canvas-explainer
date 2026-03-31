import { parser } from "@lezer/javascript";
import { Code, LezerHighlighter, lines, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import { all, createRef, easeInOutCubic, waitFor } from "@motion-canvas/core";
import { IdeWindow, IdeWindowProps } from "../components/IdeWindow";

const mono = '"JetBrains Mono", "Cascadia Code", Consolas, monospace';
const uiSans = 'Inter, "Segoe UI", system-ui, sans-serif';

const state1 = `
import Image from "next/image";


export default function Home() {
  return (
  <div>
    
   </div>
  );
}
`
const state2 = `
import Image from "next/image";
import { CardLists } from "./Components/CardList";

export default function Home() {
  return (
   <div className="h-screen w-screen flex flex-col justify-center items-center">
    <div className="mt-[300px]">
      <CardLists />
    </div>  
   </div>
  );
}
  `

const jsHighlighter = new LezerHighlighter(
  parser.configure({ dialect: "jsx ts" }),
);

export default makeScene2D(function* (view) {
  view.fill("#000000");

  const code1 = createRef<Code>();
  view.add(
    <Code
      ref={code1}
      code={`
        "hey there"
`}
      highlighter={jsHighlighter}
      fontFamily={mono}
      fontSize={40}
      lineHeight={"150%"}
      width={"100%"}
      grow={1}
      opacity={0}
    />,
  );
  const code2 = createRef<Code>();
  view.add(
    <Code
      ref={code2}
      code={`
        lets discuss about how we make people hooked
`}
      highlighter={jsHighlighter}
      fontFamily={mono}
      fontSize={40}
      lineHeight={"150%"}
      width={"100%"}
      grow={1}
      opacity={0}
    />,
  );
  const code3 = createRef<Code>();
  view.add(
    <Code
      ref={code3}
      code={`
        via infinite scroll
`}
      highlighter={jsHighlighter}
      fontFamily={mono}
      fontSize={40}
      lineHeight={"150%"}
      width={"100%"}
      grow={1}
      opacity={0}
    />,
  );
  const shell1 = createRef<Rect>();
  const shell1code = createRef<Code>();
  view.add(
  <IdeWindow
  shellRef={shell1}
  title={"page.tsx"}
  subtitle={"JavaScript"}
  shellWidth={1000}
  shellHeight={400}
  shellFill={"#1C1C1C"}
  titleBarFill={"#161616"}
  bodyFill={"#141414"}
  bodyPadding={[24, 28]}
  bodyGap={8}
  opacity={0}
  scale={0.95}
  > 
  <Code
  code={state1}
  highlighter={jsHighlighter}
  fontFamily={mono}
  ref={shell1code}
  fontSize={20}
  lineHeight={"150%"}
  width={"100%"}
  grow={1}
  opacity={1}
  />
  </IdeWindow>
  );

  const heyRange = code1().findFirstRange(/hey/g);
  const thereRange = code1().findFirstRange(/there/g);
  const targets = ["lets", "discuss","about", "how", "we", "make", "people", "hooked"];
  const infinitescroll = ["via", "infinite", "scroll"];



  yield* waitFor(0.2);
  yield* code1().opacity(1, 0.5);
  yield* code1().selection(heyRange, 0.2);
  yield* waitFor(0.2);
  yield* code1().selection(thereRange, 0.2);
  yield* code1().opacity(0, 0.5);
  yield* code2().opacity(1, 0.5);
  for (const wordText of targets) {
    const range = code2().findFirstRange(new RegExp(`\\b${wordText}\\b`, "g"));
    yield* code2().selection(range, 0.2, easeInOutCubic);
    yield* waitFor(0.01);
  }
  yield* code2().opacity(0, 0.5);
  yield* code3().opacity(1,0.5);
  for (const wordText of infinitescroll) {
    const range = code3().findFirstRange(new RegExp(`\\b${wordText}\\b`, "g"));
    
    yield* code3().selection(range, 0.2, easeInOutCubic);
 
  }
  yield* code3().opacity(1, 0.5);
  yield* code3().opacity(0, 0.5)
  yield* shell1().opacity(1, 0.5); 
  yield* waitFor(3);
  yield* all( 
    shell1().height(500, 0.2),
    shell1code().code(state2, 0.5),
  )
  yield* waitFor(3);
  yield* shell1().opacity(0, 0.5);
  yield* waitFor(3);
});
