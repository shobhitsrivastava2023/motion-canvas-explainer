import {Circle, Layout, Rect, Txt} from '@motion-canvas/2d';
import type {ComponentChildren} from '@motion-canvas/2d';
import type {
  PossibleSpacing,
  PossibleVector2,
  ReferenceReceiver,
  SignalValue,
} from '@motion-canvas/core';

const uiSans = 'Inter, "Segoe UI", system-ui, sans-serif';

export interface IdeWindowProps {
  /** Outer window — use for scale/opacity intro animations. */
  shellRef?: ReferenceReceiver<Rect>;
  /** Title bar filename (e.g. `page.tsx`, `greeting.js`). */
  title?: string;
  /** Optional ref to `Txt` when you need to change the tab label in the generator. */
  titleRef?: ReferenceReceiver<Txt>;
  /** Muted text on the right (framework, “Terminal”, etc.). */
  subtitle?: string;
  shellWidth?: number;
  shellHeight?: number;
  shellFill?: string;
  shellStroke?: string;
  shellLineWidth?: number;
  shellRadius?: number;
  /** macOS-style chrome; set false for a minimal bar. */
  trafficLights?: boolean;
  titleBarHeight?: number;
  titleBarFill?: string;
  titleBarStroke?: string;
  /** Main editor / content area behind children. */
  bodyFill?: string;
  bodyPadding?: PossibleSpacing;
  /** Gap between stacked children (e.g. multiple `Code` lines). */
  bodyGap?: number;
  clip?: boolean;
  /** Passed through to the outer shell `Rect` (intro animations). */
  opacity?: SignalValue<number>;
  scale?: SignalValue<PossibleVector2 | number>;
  scaleX?: SignalValue<number>;
  scaleY?: SignalValue<number>;
  children?: ComponentChildren;
}

/**
 * VS Code–style window: traffic lights, tab title, dark body.
 * Pass **`children`** for any mix of `Code`, `Txt`, `Layout`, etc.
 * Keep the inner body as flex (`layout`) so text/code measure correctly.
 */
export function IdeWindow({
  shellRef,
  title = 'untitled',
  titleRef,
  subtitle = '',
  shellWidth = 1000,
  shellHeight = 480,
  shellFill = '#000000',
  shellStroke = '#2a2a2a',
  shellLineWidth = 2,
  shellRadius = 10,
  trafficLights = true,
  titleBarHeight = 48,
  titleBarFill = '#0d0d0d',
  titleBarStroke = '#1f1f1f',
  bodyFill = '#000000',
  bodyPadding = [20, 28],
  bodyGap = 8,
  clip = true,
  opacity,
  scale,
  scaleX,
  scaleY,
  children,
}: IdeWindowProps) {
  return (
    <Rect
      ref={shellRef}
      width={shellWidth}
      height={shellHeight}
      fill={shellFill}
      stroke={shellStroke}
      lineWidth={shellLineWidth}
      radius={shellRadius}
      direction={'column'}
      clip={clip}
      layout
      opacity={opacity}
      scale={scale}
      scaleX={scaleX}
      scaleY={scaleY}
    >
      <Rect
        height={titleBarHeight}
        fill={titleBarFill}
        stroke={titleBarStroke}
        lineWidth={1}
        direction={'row'}
        alignItems={'center'}
        padding={[0, 18]}
        gap={14}
        layout
      >
        {trafficLights ? (
          <Layout layout direction={'row'} gap={8} alignItems={'center'}>
            <Circle size={11} fill={'#ff5f56'} />
            <Circle size={11} fill={'#ffbd2e'} />
            <Circle size={11} fill={'#27c93f'} />
          </Layout>
        ) : (
          <Layout layout width={24} />
        )}
        <Txt
          ref={titleRef}
          text={title}
          fill={'#e6edf3'}
          fontFamily={uiSans}
          fontSize={20}
          fontWeight={500}
        />
        <Layout layout grow={1} />
        {subtitle ? (
          <Txt
            text={subtitle}
            fill={'#6e7681'}
            fontFamily={uiSans}
            fontSize={17}
          />
        ) : null}
      </Rect>

      <Rect grow={1} fill={bodyFill} direction={'column'} layout>
        <Layout
          layout
          grow={1}
          width={'100%'}
          padding={bodyPadding}
          direction={'column'}
          alignItems={'start'}
          justifyContent={'start'}
          gap={bodyGap}
        >
          {children}
        </Layout>
      </Rect>
    </Rect>
  );
}
