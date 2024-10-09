/**
 * @fileoverview Detect classnames which do not belong to Tailwind CSS
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-custom-classname");
var RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var parserOptions = {
  ecmaVersion: 2019,
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
};

const skipClassAttributeOptions = [
  {
    skipClassAttribute: true,
    config: {
      theme: {},
      plugins: [],
    },
  },
];
var generateErrors = (classnames) => {
  const errors = [];
  if (typeof classnames === "string") {
    classnames = classnames.split(" ");
  }
  classnames.map((classname) => {
    errors.push({
      messageId: "customClassnameDetected",
      data: {
        classname: classname,
      },
    });
  });
  return errors;
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-custom-classname", rule, {
  valid: [
    {
      code: `<div className="ns-dark">Custom dark class</div>`,
      options: [
        {
          config: { darkMode: ["class", ".ns-dark"] },
        },
      ],
    },
    {
      code: `<div class="group peer">Hover, Focus, & Other States</div>`,
    },
    {
      code: `<div className="dark">dark should be allowed in class mode</div>`,
      options: [
        {
          config: { darkMode: "class" },
        },
      ],
    },
    {
      code: `<div className="[mask-type:luminance] hover:[mask-type:alpha] [--scroll-offset:56px] grid grid-cols-[1fr_500px_2fr]">dark should be allowed in class mode</div>`,
    },
    {
      code: `
      <section>
        <h1>Layout utilities</h1>
        <div class="container">Container</div>
        <div class="box-content lg:box-border">Box Sizing</div>
        <div class="inline-block sm:block md:flex lg:table">Display</div>
        <div class="float-none sm:float-left md:float-right">Floats</div>
        <div class="clear-left sm:clear-right md:clear-both lg:clear-none">Clear</div>
        <div class="isolate sm:isolation-auto">Isolation</div>
        <div class="object-contain sm:object-cover md:object-fill lg:object-none dark:object-scale-down">Object Fit</div>
        <div class="overflow-auto sm:overflow-scroll">Overflow</div>
        <div class="overscroll-none md:overscroll-y-auto">Overscroll Behavior</div>
        <div class="fixed sm:absolute">Position</div>
        <div class="visible sm:invisible">Visibility</div>
      </section>`,
    },
    {
      code: `<div class="columns-2 hover:columns-3 lg:columns-[10rem]">Columns</div>`,
    },
    {
      code: `<div class="break-after-auto md:break-after-avoid-page break-before-left break-inside-avoid-column">Break</div>`,
    },
    {
      code: `<div class="box-decoration-clone	sm:box-decoration-slice">Box Decoration Break</div>`,
    },
    {
      code: `<div class="object-right object-[center_bottom]">Object Position</div>`,
    },
    {
      code: `<div class="inset-x-0 top-2 -left-2 bottom-[3px] right-[-3px]">Top / Right / Bottom / Left</div>`,
    },
    {
      code: `<div class="z-0 sm:z-1000 md:-z-1000 lg:z-[100] dark:-z-0 sm:dark:z-1000 md:dark:-z-1000 lg:dark:z-[100] xl:dark:-z-666">Z-Index</div>`,
      options: [
        {
          config: {
            theme: {
              extend: {
                zIndex: {
                  0: "0",
                  "-666": "-666",
                  1000: "1000",
                },
              },
            },
          },
        },
      ],
    },
    {
      code: `
      <section>
        <h1>Flexbox & Grid</h1>
        <div class="basis-[14.2857143%] sm:basis-1">Flex Basis</div>
        <div class="flex-row">Flex Direction</div>
        <div class="flex-wrap">Flex Wrap</div>
        <div class="flex-auto sm:flex-1 flex-[2_2_0%]">Flex</div>
        <div class="grow sm:grow-0 md:grow-[2]">Flex Grow</div>
        <div class="shrink sm:shrink-0 md:shrink-[2]">Flex Shrink</div>
        <div class="order-1 sm:order-[13]">Order</div>
        <div class="grid-cols-6 sm:grid-cols-[200px_minmax(900px,_1fr)_100px]"></div>
        <div class="col-auto sm:col-span-1 md:col-[span_1_/_span_3]">Grid Column Start / End</div>
        <div class="grid-rows-4 sm:grid-rows-[200px_minmax(900px,_1fr)_100px]">Grid Template Rows</div>
        <div class="row-auto sm:row-span-6 md:row-span-full lg:row-[span_16_/_span_16]">Grid Row Start / End</div>
        <div class="grid-flow-row-dense">Grid Auto Flow</div>
        <div class="auto-cols-max sm:auto-cols-[minmax(0,_2fr)]">Grid Auto Columns</div>
        <div class="auto-rows-max auto-rows-[minmax(0,_2fr)]">Grid Auto Rows</div>
        <div class="gap-x-0 sm:gap-y-3 gap-[2.75rem]">Gap</div>
        <div class="justify-end	">Justify Content</div>
        <div class="justify-items-end	">Justify Items</div>
        <div class="justify-self-start">Justify Self</div>
        <div class="content-center">Align Content</div>
        <div class="items-baseline">Align Items</div>
        <div class="self-stretch">Align Self</div>
        <div class="place-content-evenly">Place Content</div>
        <div class="place-items-center">Place Items</div>
        <div class="place-self-center">Place Self</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Spacing</h1>
        <div class="p-1 sm:pr-0 md:px-[5px]">Padding</div>
        <div class="m-1 sm:mr-0 md:mx-[5px] lg:-ml-1">Margin</div>
        <div class="space-x-0 sm:space-y-1 md:space-x-reverse lg:space-y-reverse xl:space-y-[5px] dark:-space-x-1 sm:dark:-space-y-1 xl:dark:space-y-[-5px]">Space Between</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Sizing</h1>
        <div class="w-0 sm:w-px md:w-1/2 lg:w-max xl:w-[32rem]">Width</div>
        <div class="min-w-0 sm:min-w-full md:min-w-min lg:min-w-max xl:min-w-[50%]">Min-Width</div>
        <div class="max-w-0 sm:max-w-none md:max-w-2xl lg:max-w-screen-xl xl:max-w-[50%]">Max-Width</div>
        <div class="h-0 sm:h-px md:h-1/2 lg:h-max xl:h-[32rem]">Height</div>
        <div class="min-h-0 sm:min-h-full md:min-h-min lg:min-h-max xl:min-h-[50%]">Min-Height</div>
        <div class="max-h-0 sm:max-h-2 md:max-h-full lg:max-h-screen xl:max-h-[32rem]">Max-Height</div>
        <div class=""></div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Typography</h1>
        <div class="font-sans sm:font-serif md:font-mono lg:font-['Open_Sans']">Font Family</div>
        <div class="text-xs sm:text-base md:text-2xl lg:text-[14px]">Font Size</div>
        <div class="antialiased sm:subpixel-antialiased">Font Smoothing</div>
        <div class="italic sm:not-italic">Font Style</div>
        <div class="font-thin sm:font-extralight md:font-light lg:font-normal xl:font-medium dark:font-semibold sm:dark:font-bold md:dark:font-extrabold lg:dark:font-black xl:dark:font-[1100]">Font Weight</div>
        <div class="ordinal slashed-zero tabular-nums sm:normal-nums md:lining-nums lg:oldstyle-nums xl:proportional-nums 2xl:tabular-nums">Font Variant Numeric</div>
        <div class="tracking-tighter sm:tracking-tight md:tracking-normal lg:tracking-wide xl:tracking-wider 2xl:tracking-widest dark:tracking-[.25em] sm:dark:-tracking-wide md:dark:-tracking-normal lg:dark:tracking-[-.25em]">Letter Spacing</div>
        <div class="leading-3 sm:leading-none md:leading-tight lg:leading-snug xl:leading-normal 2xl:leading-relaxed dark:leading-loose sm:dark:leading-[3rem]">Line Height</div>
        <div class="list-none sm:list-disc md:list-decimal lg:list-[upper-roman]">List Style Type</div>
        <div class="list-inside sm:list-outside">List Style Position</div>
        <div class="text-left sm:text-center md:text-right lg:text-justify">Text Alignment</div>
        <div class="text-inherit sm:text-current md:text-transparent lg:text-black xl:text-white 2xl:text-slate-200 dark:text-[#50d71e] sm:dark:text-[color:var(--yolo)] first:text-black/50 last:text-[#F005] even:text-[#F0F5F6B8] odd:text-[rgba(100,10,140,.5)]">Text Color</div>
        <div class="underline sm:overline md:line-through lg:no-underline">Text Decoration</div>
        <div class="decoration-inherit sm:decoration-current md:decoration-transparent lg:text-black xl:decoration-white 2xl:decoration-slate-200 dark:decoration-[#50d71e] sm:dark:decoration-[color:var(--yolo)] first:decoration-black/50 last:decoration-[#F005] even:decoration-[#F0F5F6B8] odd:decoration-[rgba(100,10,140,.5)]">Text Decoration Color</div>
        <div class="decoration-solid sm:decoration-double md:decoration-dotted lg:decoration-dashed xl:decoration-wavy">Text Decoration Style</div>
        <div class="decoration-auto sm:decoration-from-font md:decoration-0 lg:decoration-8 xl:decoration-[3px] 2xl:decoration-[length:var(--yolo)]">Text Decoration Thickness</div>
        <div class="underline-offset-auto sm:underline-offset-0 md:underline-offset-8 underline-offset-[3px]">Text Underline Offset</div>
        <div class="uppercase sm:lowercase md:capitalize lg:normal-case">Text Transform</div>
        <div class="truncate sm:text-ellipsis md:text-clip">Text Overflow</div>
        <div class="indent-0 sm:indent-3 md:indent-[50%] lg:-indent-3 xl:indent-[-10px]">Text Indent</div>
        <div class="align-baseline sm:align-top md:align-middle lg:align-bottom xl:align-text-top dark:align-text-bottom sm:dark:align-sub md:dark:align-super">Vertical Alignment</div>
        <div class="whitespace-normal sm:whitespace-nowrap md:whitespace-pre lg:whitespace-pre-line xl:whitespace-pre-wrap">Whitespace</div>
        <div class="break-normal sm:break-words md:break-all">Word Break</div>
        <div class="content-none after:content-['_↗'] before:content-[attr(before)] sm:before:content-['Hello_World'] md:before:content-['Hello\_World'] lg:before:content-[url('/icons/link.svg')]">Content</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Backgrounds</h1>
        <div class="bg-fixed sm:bg-local md:bg-scroll">Background Attachment</div>
        <div class="bg-clip-border sm:bg-clip-padding md:bg-clip-content lg:bg-clip-text">Background Clip</div>
        <div class="bg-inherit sm:bg-current md:bg-black lg:bg-lime-900 xl:bg-[#50d71e] 2xl:bg-[color:var(--some)]">Background Color</div>
        <div class="bg-origin-border sm:bg-origin-padding md:bg-origin-content">Background Origin</div>
        <div class="bg-bottom sm:bg-center md:bg-left lg:bg-left-bottom xl:bg-left-top 2xl:bg-right dark:bg-right-bottom sm:dark:bg-right-top md:dark:bg-top lg:dark:bg-[center_top_1rem]">Background Position</div>
        <div class="bg-repeat sm:bg-no-repeat md:bg-repeat-x lg:bg-repeat-y xl:bg-repeat-round 2xl:bg-repeat-space">Background Repeat</div>
        <div class="bg-auto sm:bg-cover md:bg-contain lg:bg-[length:200px_100px]">Background Size</div>
        <div class="bg-none sm:bg-gradient-to-tr md:bg-[url('/img/hero-pattern.svg')]">Background Image</div>
        <div class="from-inherit sm:from-current md:from-transparent lg:from-black xl:from-[#243c5a] 2xl:from-[#243c5a/50] first:from-black/50 last:from-[#F005] even:from-[#F0F5F6B8] odd:from-[rgba(100,10,140,.5)]">Gradient Color Stops</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Borders</h1>
        <div class="rounded-none sm:rounded-xl md:rounded-t-md lg:rounded-br-3xl xl:rounded-[12px]">Border Radius</div>
        <div class="border sm:border-0 md:border-x-2 lg:border-y-8 xl:border-r 2xl:border-t-[3px]">Border Width</div>
        <div class="border-transparent sm:border-rose-500 md:border-t-indigo-500/75 lg:border-x-indigo-500 xl:border-[#243c5a] first:border-black/50 last:border-[#F005] even:border-[#F0F5F6B8] odd:border-[rgba(100,10,140,.5)]">Border Color</div>
        <div class="border-solid sm:border-dashed md:border-dotted lg:border-double xl:border-hidden 2xl:border-none">Border Style</div>
        <div class="divide-y-4 sm:divide-x-8 md:divide-y lg:divide-y-reverse xl:divide-x-reverse 2xl:divide-x-[3px]">Divide Width</div>
        <div class="divide-gray-400/25 sm:divide-amber-400 md:divide-[#243c5a] first:divide-black/50 last:divide-[#F005] even:divide-[#F0F5F6B8] odd:divide-[rgba(100,10,140,.5)]">Divide Color</div>
        <div class="divide-solid sm:divide-dashed md:divide-dotted lg:divide-double xl:divide-none">Divide Style</div>
        <div class="outline-0 sm:outline-4 md:outline-[5px]">Outline Width</div>
        <div class="outline-inherit sm:outline-current md:outline-black lg:outline-lime-900 xl:outline-[#50d71e] 2xl:outline-[color:var(--some)] first:outline-black/50 last:outline-[#F005] even:outline-[#F0F5F6B8] odd:outline-[rgba(100,10,140,.5)]">Outline Color</div>
        <div class="outline-none sm:outline md:outline-dashed lg:outline-dotted xl:outline-double 2xl:outline-hidden">Outline Style</div>
        <div class="outline-offset-4 sm:outline-offset-[3px]">Outline Offset</div>
        <div class="ring-0 sm:ring-4 md:ring-inset lg:ring-[10px]">Ring Width</div>
        <div class="ring-inherit sm:ring-current md:ring-black lg:ring-lime-900 xl:ring-[#50d71e] 2xl:ring-[color:var(--some)] first:ring-black/50 last:ring-[#F005] even:ring-[#F0F5F6B8] odd:ring-[rgba(100,10,140,.5)]">Ring Color</div>
        <div class="ring-offset-4 sm:ring-offset-[3px]">Ring Offset Width</div>
        <div class="ring-offset-inherit sm:ring-offset-current md:ring-offset-black lg:ring-offset-lime-900 xl:ring-offset-[#50d71e] 2xl:ring-offset-[color:var(--some)] first:ring-offset-black/50 last:ring-offset-[#F005] even:ring-offset-[#F0F5F6B8] odd:ring-offset-[rgba(100,10,140,.5)]">Ring Offset Color</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Effects</h1>
        <div class="shadow sm:shadow-lg md:shadow-inner lg:shadow-none xl:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">Box Shadow</div>
        <div class="shadow-inherit sm:shadow-current md:shadow-black lg:shadow-lime-900 xl:shadow-[#50d71e] 2xl:shadow-[color:var(--some)] first:shadow-black/50 last:shadow-[#F005] even:shadow-[#F0F5F6B8] odd:shadow-[rgba(100,10,140,.5)]">Box Shadow Color</div>
        <div class="opacity-0 sm:opacity-50 md:opacity-[.67]">Opacity</div>
        <div class="mix-blend-normal sm:mix-blend-multiply md:mix-blend-screen lg:mix-blend-overlay xl:mix-blend-darken 2xl:mix-blend-lighten dark:mix-blend-color-dodge sm:dark:mix-blend-color-burn md:dark:mix-blend-hard-light lg:dark:mix-blend-soft-light xl:dark:mix-blend-difference 2xl:dark:mix-blend-exclusion hover:mix-blend-hue first:mix-blend-saturation last:mix-blend-color focus:mix-blend-luminosity">Mix Blend Mode</div>
        <div class="bg-blend-normal sm:bg-blend-multiply md:bg-blend-screen lg:bg-blend-overlay xl:bg-blend-darken 2xl:bg-blend-lighten dark:bg-blend-color-dodge focus:bg-blend-color-burn link:bg-blend-hard-light visited:bg-blend-soft-light hover:bg-blend-difference active:bg-blend-exclusion first:bg-blend-hue last:bg-blend-saturation odd:bg-blend-color even:bg-blend-luminosity">Background Blend Mode</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Filters</h1>
        <div class="blur-none sm:blur md:blur-lg lg:blur-[2px]">Blur</div>
        <div class="brightness-0 sm:brightness-100 md:brightness-[1.75]">Brightness</div>
        <div class="contrast-0 sm:contrast-100 md:contrast-[.75]">Contrast</div>
        <div class="drop-shadow sm:drop-shadow-none md:drop-shadow-xl lg:drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]">Drop Shadow</div>
        <div class="grayscale sm:grayscale-0 md:grayscale-[50%]">Grayscale</div>
        <div class="hue-rotate-0 sm:hue-rotate-90 md:-hue-rotate-15 lg:hue-rotate-[270deg] xl:hue-rotate-[-7deg] 2xl:hue-rotate-[var(--yolo)]">Hue Rotate</div>
        <div class="invert sm:invert-0 md:invert-[.25]">Invert</div>
        <div class="saturate-0 sm:saturate-150 md:saturate-[.25]">Saturate</div>
        <div class="sepia-0 sm:sepia md:sepia-[.25]">Sepia</div>
        <div class="backdrop-blur sm:backdrop-blur-lg md:backdrop-blur-[2px]">Backdrop Blur</div>
        <div class="backdrop-brightness-50 sm:backdrop-brightness-200 md:backdrop-brightness-[1.75]">Backdrop Brightness</div>
        <div class="backdrop-contrast-100 sm:backdrop-contrast-0 md:backdrop-contrast-[.25]">Backdrop Contrast</div>
        <div class="backdrop-grayscale-0 sm:backdrop-grayscale md:backdrop-grayscale-[.5]">Backdrop Grayscale</div>
        <div class="-backdrop-hue-rotate-15 sm:backdrop-hue-rotate-15 md:backdrop-hue-rotate-[15deg]">Backdrop Hue Rotate</div>
        <div class="backdrop-invert-0 sm:backdrop-invert md:backdrop-invert-[.25]">Backdrop Invert</div>
        <div class="backdrop-opacity-50 sm:backdrop-opacity-25 md:backdrop-opacity-[.15]">Backdrop Opacity</div>
        <div class="backdrop-saturate-150 sm:backdrop-saturate-50 md:backdrop-saturate-[.25]">Backdrop Saturate</div>
        <div class="backdrop-sepia sm:backdrop-sepia-0 md:backdrop-sepia-[.25]">Backdrop Sepia</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Tables</h1>
        <div class="border-collapse md:border-separate">Border Collapse</div>
        <div class="table-auto sm:table-fixed">Table Layout</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Transitions & Animation</h1>
        <div class="transition-none sm:transition-all md:transition lg:transition-colors xl:transition-opacity 2xl:transition-shadow dark:transition-transform first:transition-[height]">Transition Property</div>
        <div class="duration-100 sm:duration-200 md:duration-[2000ms]">Transition Duration</div>
        <div class="ease-linear sm:ease-in md:ease-out lg:ease-in-out xl:ease-[cubic-bezier(0.95,0.05,0.795,0.035)]">Transition Timing Function</div>
        <div class="delay-75 sm:delay-500 md:delay-[2000ms]">Transition Delay</div>
        <div class="animate-none sm:animate-spin md:animate-ping lg:animate-pulse xl:animate-bounce 2xl:animate-[wiggle_1s_ease-in-out_infinite]">Animation</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Transforms</h1>
        <div class="scale-x-50 sm:scale-y-75 md:scale-0 lg:scale-[1.7] transform-gpu">Scale</div>
        <div class="rotate-45 sm:-rotate-90 md:rotate-[17deg]">Rotate</div>
        <div class="translate-x-2.5 sm:translate-y-3 md:-translate-y-10 lg:translate-y-[17rem]">Translate</div>
        <div class="skew-y-3 skew-x-6 sm:-skew-y-6 md:skew-y-[17deg] lg:skew-y-[-45deg]">Skew</div>
        <div class="origin-center sm:origin-top md:origin-top-right lg:origin-right xl:origin-bottom-right dark:origin-bottom first:origin-bottom-left last:origin-left odd:origin-top-left even:origin-[33%_75%]">Transform Origin</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Interactivity</h1>
        <div class="accent-emerald-500/25 sm:accent-violet-300 2xl:accent-[#50d71e] first:accent-black/50 last:accent-[#F005] even:accent-[#F0F5F6B8] odd:accent-[rgba(100,10,140,.5)]">Accent Color</div>
        <div class="appearance-none">Appearance</div>
        <div class="cursor-auto sm:cursor-default md:cursor-pointer lg:cursor-wait xl:cursor-text 2xl:cursor-move dark:cursor-help sm:dark:cursor-not-allowed md:dark:cursor-none lg:dark:cursor-context-menu xl:dark:cursor-progress 2xl:dark:cursor-cell dark:focus:cursor-crosshair dark:active:cursor-vertical-text dark:valid:cursor-alias first:cursor-copy last:cursor-no-drop even:cursor-grab odd:cursor-grabbing empty:cursor-all-scroll disabled:cursor-col-resize active:cursor-row-resize visited:cursor-n-resize hover:cursor-e-resize focus:cursor-s-resize link:cursor-w-resize only:cursor-ne-resize focus-visible:cursor-nw-resize disabled:cursor-se-resize checked:cursor-sw-resize required:cursor-ew-resize invalid:cursor-ns-resize valid:cursor-nesw-resize in-range:cursor-nwse-resize out-of-range:cursor-zoom-in open:cursor-zoom-out open:first:cursor-[url(hand.cur),_pointer]">Cursor</div>
        <div class="caret-emerald-500/25 sm:caret-violet-300 2xl:caret-[#50d71e] first:caret-black/50 last:caret-[#F005] even:caret-[#F0F5F6B8] odd:caret-[rgba(100,10,140,.5)]">Caret Color</div>
        <div class="pointer-events-none sm:pointer-events-auto">Pointer Events</div>
        <div class="resize-none sm:resize-y md:resize-x lg:resize">Resize</div>
        <div class="scroll-auto sm:scroll-smooth">Scroll Behavior</div>
        <div class="scroll-m-0 sm:scroll-mx-px md:scroll-my-0.5 lg:scroll-mb-1 xl:-scroll-mr-1 2xl:scroll-m-[24rem]">Scroll Margin</div>
        <div class="scroll-p-0 sm:scroll-px-px md:scroll-py-0.5 lg:scroll-pb-1 xl:scroll-pr-1 2xl:scroll-p-[24rem]">Scroll Padding</div>
        <div class="snap-start sm:snap-end md:snap-center lg:snap-align-none">Scroll Snap Align</div>
        <div class="snap-normal sm:snap-always">Scroll Snap Stop</div>
        <div class="snap-none sm:snap-x md:snap-y lg:snap-both xl:snap-mandatory 2xl:snap-proximity">Scroll Snap Type</div>
        <div class="touch-auto sm:touch-none md:touch-pan-x lg:touch-pan-left xl:touch-pan-right 2xl:touch-pan-y dark::touch-pan-up first:touch-pan-down last:touch-pinch-zoom focus:touch-manipulation">Touch Action</div>
        <div class="select-none sm:select-text md:select-all lg:select-auto">User Select</div>
        <div class="will-change-auto sm:will-change-scroll md:will-change-contents lg:will-change-transform">Will Change</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>SVG</h1>
        <div class="fill-emerald-500 sm:fill-violet-300 2xl:fill-[#50d71e] first:fill-black/50 last:fill-[#F005] even:fill-[#F0F5F6B8] odd:fill-[rgba(100,10,140,.5)]">Fill</div>
        <div class="stroke-emerald-500 sm:stroke-violet-300 2xl:stroke-[#50d71e] first:stroke-black/50 last:stroke-[#F005] even:stroke-[#F0F5F6B8] odd:stroke-[rgba(100,10,140,.5)]">Stroke</div>
        <div class="stroke-0 sm:stroke-1 md:stroke-2 lg:stroke-[2px]">Stroke Width</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Accessibility</h1>
        <div class="sr-only sm:not-sr-only">Screen Readers</div>
      </section>`,
    },
    {
      code: `
      <section>
        <h1>Official Plugins</h1>
        <div class=""></div>
      </section>`,
    },
    {
      code: `<template><div class="container box-content lg:box-border max-h-24 self-end">Only Tailwind CSS classnames</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      ctl(\`
        sm:w-6
        w-8
        container
        w-12
        flex
        lg:w-4
      \`);`,
    },
    {
      code: `<div class="tw-container tw-box-content lg_tw-box-border">Only Tailwind CSS classnames</div>`,
      options: [
        {
          config: { prefix: "tw-", separator: "_" },
        },
      ],
    },
    {
      code: `<div class="!arbitrary-inset-[123px]">Allow arbitrary value support + Built-in important modifier</div>`,
      options: [
        {
          config: {
            prefix: "arbitrary-",
          },
        },
      ],
    },
    {
      code: `<div class="dark:focus:hover:bg-black md:dark:disabled:focus:hover:bg-gray-400">Stackable variants</div>`,
    },
    {
      code: `<div class="bg-custom-color">Using dash in custom color name</div>`,
      options: [
        {
          config: {
            theme: {
              colors: {
                "custom-color": "#B4D4AA",
              },
            },
          },
        },
      ],
    },
    {
      code: `<div className={clsx(\`flex w-full\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
        },
      ],
    },
    {
      code: `<div className="flex skin-summer custom-2">whitelisted</div>`,
      options: [
        {
          whitelist: ["skin\\-(summer|xmas)", "custom\\-[1-3]"],
        },
      ],
    },
    {
      code: `<div className="text-foo border-bar">defined in textColor</div>`,
      options: [
        {
          config: { theme: { textColor: { foo: "#123456" }, borderColor: { bar: "#654321" } } },
        },
      ],
    },
    {
      code: `
      <div class="group border-indigo-500 hover:bg-white hover:shadow-lg hover:border-transparent">
      <p class="text-indigo-600 group-hover:text-gray-900">New Project</p>
      <p class="text-indigo-500 group-hover:text-gray-500">Create a new project from a variety of starting templates.</p>
      </div>`,
    },
    {
      code: `
      <div class="some base white-listed classnames">
        from css file
      </div>`,
      options: [
        {
          cssFiles: ["./tests/lib/**/*.css"],
        },
      ],
    },
    ...["myTag", "myTag.subTag", "myTag(SomeComponent)"].map((tag) => ({
      code: `
      ${tag}\`
        sm:w-6
        w-8
        container
        w-12
        flex
        lg:w-4
      \`;`,
      options: [{ tags: ["myTag"] }],
    })),
    {
      code: `
      <div class="flex flex-row-reverse space-x-4 space-x-reverse">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </div>`,
    },
    {
      code: `
      <div class="text-red-700 border-2 border-current bg-current p-10">
        <input class="bg-gray-500 text-white placeholder:text-black" placeholder="placeholder color" />
        <div class="text-yellow-400">
          <div class="divide-current divide-y-4">
            <button class="ring-2 p-2 focus:ring-current ring-offset-current ring-offset-2 outline-none">button with ringColor</button>
            <div>2</div>
            <div class="text-current">3</div>
          </div>
        </div>
        <svg class="stroke-current text-yellow-400 stroke-2">
          <circle cx="50" cy="50" r="20" />
        </svg>
        <svg class="fill-current text-yellow-400 stroke-0">
          <circle cx="50" cy="50" r="20" />
        </svg>
        <div class="bg-gradient-to-r from-red-500 to-current text-green-300 h-20 w-full"></div>
        <div class="bg-gradient-to-l from-current to-black text-green-300 h-20 w-full"></div>
      </div>
      `,
    },
    {
      code: `
      <div class="bg-red-600 p-10">
        <p class="text-yellow-400 border-2 border-green-600 border-t-current p-2">border-t-current</p>
      </div>
      `,
    },
    {
      code: `
      <div class="aspect-none">
        aspect-none is a valid classname
      </div>`,
    },
    {
      code: `
      <div class="font-mono">
        font-mono is a valid classname
      </div>`,
    },
    {
      code: `
      <div className={'stroke-sky-500/[.1]'}>Arbitrary alpha suffix</div>`,
    },
    {
      code: `
      <div className={'!hidden sm:!flex lg:!block 2xl:!block'}>Important modifier</div>`,
    },
    {
      code: `
      <button
      type="button"
      className={classnames(
        "p-2 font-medium",
        boolVal ? false : "text-black"
      )}
      />`,
    },
    {
      code: `
      <button
      type="button"
      className={classnames(
        ["p-2 font-medium"],
        [{"text-black": boolVal}]
      )}
      />`,
    },
    {
      code: `
      <div className="-mt-4">Negative value with custom config</div>`,
      options: [
        {
          config: {
            theme: {
              spacing: {
                4: "calc(4 * .25rem)",
              },
            },
          },
        },
      ],
    },
    {
      code: `
      <div className="transform-none">Disabling transform</div>`,
    },
    {
      code: `
      <div className="p/r[e].f!-x_flex">Nasty prefix</div>`,
      options: [
        {
          config: {
            prefix: "p/r[e].f!-x_",
          },
        },
      ],
    },
    {
      code: `
      <div className="text-9xl text-ffffff/[24%] bg-000000">Issue #101</div>`,
      options: [
        {
          config: {
            theme: {
              colors: {
                "000000": "#000000",
                ffffff: "#ffffff",
              },
            },
            plugins: [],
          },
        },
      ],
    },
    {
      code: `
      <div className="grid gap-x-4 grid-cols-1fr/minmax(0/360)/1fr">Issue #100</div>`,
      options: [
        {
          config: {
            theme: {
              extend: {
                gridTemplateColumns: {
                  "1fr/minmax(0/360)/1fr": "1fr minmax(0, calc(360 * .25rem)) 1fr",
                },
              },
            },
            plugins: [],
          },
        },
      ],
    },
    {
      code: `
      <div class="transform-none">Using</div>
      <div class="flex flex-col">HTML</div>`,
      parser: require.resolve("@angular-eslint/template-parser"),
    },
    {
      code: `
      <div class="p/r[e].f!-x_flex">Using HTML</div>
      <div class="p/r[e].f!-x_block">With nasty prefix</div>`,
      options: [
        {
          config: {
            prefix: "p/r[e].f!-x_",
          },
        },
      ],
      parser: require.resolve("@angular-eslint/template-parser"),
    },
    {
      code: `
      <div class="decoration-clone decoration-slice flex-grow flex-shrink overflow-clip overflow-ellipsis bg-opacity-50 border-opacity-100 transform scale-50">Deprecated classnames yet still supported for now</div>`,
    },
    {
      code: `
      <div class="-ml-[1px] mr-[-1px]">Negative arbitrary value</div>`,
    },
    {
      code: `
      <div className={ctl(\`
        leading-loose
        prose
        md:prose-xl
        lg:prose-lg
        lg:prose-h1:text-lg
        lg:prose-h1:leading-[2.75rem]
        lg:prose-h2:text-sm
        lg:prose-h2:leading-[2.125rem]
        lg:prose-h3:text-xl
        lg:prose-h3:leading-[1.8125rem]
        lg:prose-blockquote:py-60
        lg:prose-blockquote:pr-[5rem]
        lg:prose-blockquote:pl-[6rem]
        lg:prose-p:text-xl
        lg:prose-p:leading-loose
        dark:prose-headings:text-red-100
        dark:prose-hr:border-black
        dark:prose-code:text-pink-100
        dark:prose-blockquote:text-orange-100
        dark:prose-a:bg-black
        dark:prose-a:text-black
        dark:prose-a:visited:bg-black
        dark:prose-a:visited:text-teal-200
        dark:prose-a:hover:bg-black
        dark:prose-a:hover:text-black
        dark:prose-a:focus:outline-white
        dark:prose-thead:bg-purple-500
        dark:prose-thead:text-black
        dark:prose-tr:border-b-purple-500
        dark:prose-pre:bg-[#1f2227]
        dark:prose-pre:text-[#639bee]
        dark:prose-li:before:text-green-50
      \`)}>
        https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/97
      </div>`,
      options: [
        {
          config: {
            plugins: [require("@tailwindcss/typography")],
          },
        },
      ],
    },
    {
      code: `
      <div class="bg-[#ccc]/[75%] border-t-[#000]/[5]">Issue #130</div>`,
    },
    {
      code: `
      <div class="border-spacing-2">
        Issue #148
        https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.1.0
      </div>`,
    },
    {
      code: `
      <div class="prose prose-red prose-xl dark:prose-invert prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600">
        Support for plugins
        <p class="not-prose">Not prose</p>
        <div class="aspect-w-16 aspect-h-9">
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <p class="line-clamp-3">Line clamp</p>
      </div>`,
      options: [
        {
          config: {
            plugins: [
              require("@tailwindcss/typography"),
              require("@tailwindcss/aspect-ratio"),
              require("@tailwindcss/line-clamp"),
            ],
          },
        },
      ],
    },
    {
      code: `
      <div>
        <h1 className="text-red-500">Hello, world!</h1>
        <button className="btn">Hello</button>
      </div>`,
      options: [
        {
          config: {
            plugins: [require("daisyui")],
          },
        },
      ],
    },
    {
      code: `
      <div class="text-example-1 text-category-example-1">
        https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/145
      </div>`,
      options: [
        {
          config: {
            theme: {
              colors: {
                transparent: "transparent",
                current: "currentColor",
                white: "#FFFFFF",
                black: "#000000",
                example: {
                  1: "#F0f025",
                },
                category: {
                  example: {
                    1: "#F0F025",
                  },
                },
              },
            },
          },
        },
      ],
    },
    {
      code: `
      <div>
        <div class="bg-fnprimary">PRIMARY using a function</div>
        <div class="bg-fnsecondary">SECONDARY using a function</div>
        <p>See https://github.com/adamwathan/tailwind-css-variable-text-opacity-demo</p>
      </div>`,
      options: [
        {
          config: {
            theme: {
              colors: {
                fnprimary: ({ opacityVariable, opacityValue }) => {
                  if (opacityValue !== undefined) {
                    return `rgba(var(--color-primary), ${opacityValue})`;
                  }
                  if (opacityVariable !== undefined) {
                    return `rgba(var(--color-primary), var(${opacityVariable}, 1))`;
                  }
                  return `rgb(var(--color-primary))`;
                },
                fnsecondary: ({ opacityVariable, opacityValue }) => {
                  if (opacityValue !== undefined) {
                    return `rgba(var(--color-secondary), ${opacityValue})`;
                  }
                  if (opacityVariable !== undefined) {
                    return `rgba(var(--color-secondary), var(${opacityVariable}, 1))`;
                  }
                  return `rgb(var(--color-secondary))`;
                },
              },
            },
          },
        },
      ],
    },
    {
      code: `
      <div class="grid-flow-dense mix-blend-plus-lighter border-separate border-spacing-4">
      grid-flow-dense, mix-blend-plus-lighter
      </div>`,
    },
    {
      code: `
      <div class="
        border-spacing-y-0
        border-spacing-px
        border-spacing-x-1
        border-spacing-y-2.5
        border-spacing-96"
      >
        border-spacing
      </div>`,
    },
    {
      code: `<div class>No errors while typing</div>`,
    },
    {
      code: `<div class="supports-[transform-origin:5%_5%]:grid supports-[display:grid]:grid">https://github.com/tailwindlabs/tailwindcss/pull/9453</div>`,
    },
    {
      code: `<div class="px-5 max-sm:px-2 sm:px-4">https://github.com/tailwindlabs/tailwindcss/pull/9558</div>`,
    },
    {
      code: `<div aria-checked="true" class="bg-gray-600 aria-checked:bg-blue-600">https://github.com/tailwindlabs/tailwindcss/pull/9557</div>`,
    },
    {
      code: `<div className="custom-but-allowed">negated whitelist will only check classes starting with "text-"</div>`,
      options: [
        {
          whitelist: ["(?!text\\-).*"],
        },
      ],
    },
    {
      code: `
        cva({
          variants: {
            variant: {
              primary: ["sm:w-6 w-8 container w-12 flex lg:w-4"],
              primary: ["sm:w-6 w-8 container w-12 flex lg:w-4"],
            },
          },
      });
      `,
      options: [
        {
          callees: ["cva"],
        },
      ],
    },
    {
      code: `
        cva({
          primary: ["sm:w-6 w-8 container w-12 flex lg:w-4"],
        });
      `,
      options: [
        {
          callees: ["cva"],
        },
      ],
    },
    {
      code: `<div className="text-primary-500 text-xl">https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/197</div>`,
      options: [
        {
          config: {
            theme: {
              extend: {
                colors: {
                  primary: {
                    50: "#fdf2f8",
                    100: "#fce7f3",
                    200: "#fbcfe8",
                    300: "#f9a8d4",
                    400: "#f472b6",
                    500: "#ec4899",
                    600: "#db2777",
                    700: "#be185d",
                    800: "#9d174d",
                    900: "#831843",
                  },
                },
              },
            },
          },
        },
      ],
    },
    { code: `<div className="group/edit">Custom group name</div>` },
    {
      code: `<div className="tw-group/edit">Prefix and custom group name</div>`,
      options: [
        {
          config: { prefix: "tw-" },
        },
      ],
    },
    { code: `<div className="group-hover/edit:hidden">Custom group name variant</div>` },
    {
      code: `<div className="group-hover/edit:tw-hidden">Prefix and custom group name variant</div>`,
      options: [
        {
          config: { prefix: "tw-" },
        },
      ],
    },
    {
      code: `
      <div class="group/nav123$#@%^&*_-">
        <div class="group-hover/nav123$#@%^&*_-:h-0">group/nav123$#@%^&*_-</div>
      </div>
      `,
    },
    {
      code: `
      <div class="tw-group/nav123$#@%^&*_-">
        <div class="group-hover/nav123$#@%^&*_-:tw-h-0">group/nav123$#@%^&*_-</div>
      </div>
      `,
      options: [
        {
          config: { prefix: "tw-" },
        },
      ],
    },
    {
      code: `<div className="group-hover/edit:custom-class">Custom group name variant</div>`,
      options: [
        {
          whitelist: ["custom-class"],
        },
      ],
    },
    { code: `<div className="peer/draft">Custom peer name</div>` },
    {
      code: `<div className="tw-peer/draft">Prefix and custom peer name</div>`,
      options: [
        {
          config: { prefix: "tw-" },
        },
      ],
    },
    { code: `<div className="peer-checked/draft:hidden">Custom peer name variant</div>` },
    {
      code: `<div className="peer-checked/draft:tw-hidden">Prefix and custom peer name variant</div>`,
      options: [
        {
          config: { prefix: "tw-" },
        },
      ],
    },
    {
      code: `<div className="peer-checked/draft:custom-class">Custom peer name variant</div>`,
      options: [
        {
          whitelist: ["custom-class"],
        },
      ],
    },
    {
      code: `
      // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/193
      const button = cva(["font-semibold", "border", "rounded"], {
        variants: {
          intent: {
            primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: [
              "bg-white",
              "text-gray-800",
              "border-gray-400",
              "hover:bg-gray-100",
            ],
          },
          size: {
            small: ["text-sm", "py-1", "px-2"],
            medium: ["text-base", "py-2", "px-4"],
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: "uppercase",
          },
        ],
        defaultVariants: {
          intent: "primary",
          size: "medium",
        },
      });
      `,
      options: [
        {
          callees: ["cva"],
        },
      ],
    },
    {
      code: `
        const obj = { a: 12 };
        <div className={{
          ...obj
        }}>Spread inside classname object</div>
      `,
    },
    {
      code: `
        <div>
          <div className={'h-svh min-h-svh max-h-svh'}>Dynamic viewport units</div>
          <div className={'h-lvh min-h-lvh max-h-lvh'}>Dynamic viewport units</div>
          <div className={'h-dvh min-h-dvh max-h-dvh'}>Dynamic viewport units</div>
        </div>
      `,
    },
    {
      code: `
      <label class="has-[:checked]:ring-indigo-500 has-[:checked]:text-indigo-900 has-[:checked]:bg-indigo-50">New :has() variant</label>
      `,
    },
    {
      code: `
      <ul class="*:rounded-full *:border *:border-sky-100 *:bg-sky-50 *:px-2 *:py-0.5 dark:text-sky-300 dark:*:border-sky-500/15 dark:*:bg-sky-500/10">
        <li>Sales</li>
        <li>Marketing</li>
        <li>SEO</li>
      </ul>
      `,
    },
    {
      code: `<button class="size-10">New size-* utilities</button>`,
    },
    {
      code: `<h1 class="text-wrap sm:text-nowrap md:text-balance lg:text-pretty">Balanced headlines with text-wrap utilities</h1>`,
    },
    {
      code: `
      <div class="grid grid-cols-4 gap-4">
        <div>01</div>
        <div>05</div>
        <div class="grid grid-cols-subgrid gap-4 col-span-3">
          <div class="col-start-2">06</div>
        </div>
      </div>`,
    },
    {
      code: `
      <div class="grid grid-rows-4 grid-flow-col gap-4">
        <div>01</div>
        <div>05</div>
        <div class="grid grid-rows-subgrid gap-4 row-span-3">
            <div class="row-start-2">06</div>
        </div>
        <div>07</div>
        <div>10</div>
      </div>`,
    },
    {
      code: `<div class="min-w-12">Extended min-width, max-width, and min-height scales</div>`,
    },
    {
      code: `<div class="opacity-35">Extended opacity scale</div>`,
    },
    {
      code: `<div class="grid grid-rows-9">Extended grid-rows-* scale</div>`,
    },
    {
      code: `
      <form>
        <input type="checkbox" class="appearance-none forced-colors:appearance-auto" />
      </form>`,
    },
    {
      code: `
      <h1 class="forced-color-adjust-none">New forced-color-adjust utilities</h1>`,
    },
    {
      // fix ast expression tests for null expressions
      // @see https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/345
      code: `
      <template>
        <div
          class="text-end"
          :class="(marketValue ?? 0) < (totalCost ?? 0) ? 'text-danger' : 'text-success'"
        >
          {{ marketValue?.toFixed(2) }}
        </div>
      </template>

      <script>
      export default {
        data () {
          return {
            marketValue: 10,
            totalCost: 10
          };
        }
      };
      </script>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div :class="[{'text-red-500': true, 'bg-transparent': false}]">Issue #319</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div :class="['hidden',{'text-red-500': true, 'bg-transparent': false}, 'text-red-200']">Issue #319</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div :class="[{'text-red-500': true}, 'bg-white']" :prop="['baz', true, 'foo']" :other="['val', {'baz': true, 'text-green-400': false}]">Issue #319</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div :class="['tw-hidden',{'tw-text-red-500': true, 'tw-bg-transparent': false}, 'tw-text-red-200']">Issue #319</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
      options: [
        {
          config: {
            prefix: "tw-",
            theme: {
              extend: {},
            },
          },
        },
      ],
    },
    {
      code: `<template><div :class="['hidden',{'text-red-500': true, 'bg-transparent': false}, {'text-green-500': true}, 'bg-white']">Issue #319</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    }
  ],

  invalid: [
    {
      code: `
      export interface FakePropsInterface {
        readonly name?: string;
      }
      function Fake({
        name = 'yolo'
      }: FakeProps) {
        return (
          <>
            <h1 className={"w-12 my-custom"}>Welcome {name}</h1>
            <p>Bye {name}</p>
          </>
        );
      }
      export default Fake;
      `,
      parser: require.resolve("@typescript-eslint/parser"),
      errors: generateErrors("my-custom"),
    },
    {
      code: `<div class="w-12 my-custom">my-custom is not defined in Tailwind CSS!</div>`,
      errors: generateErrors("my-custom"),
    },
    {
      code: `<template><div class="w-12 my-custom">my-custom is not defined in Tailwind CSS!</div></template>`,
      errors: generateErrors("my-custom"),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<div class="hello world">2 classnames are not defined in Tailwind CSS!</div>`,
      errors: generateErrors("hello world"),
    },
    {
      code: `
      ctl(\`
        sm:w-6
        hello
        w-8
        container
        w-12
        world
        flex
        lg:w-4
      \`);`,
      errors: generateErrors("hello world"),
    },
    {
      code: `<div class="hello tw-container tw-box-content lg_tw-box-border world">Only Tailwind CSS classnames</div>`,
      options: [
        {
          config: { prefix: "tw-", separator: "_" },
        },
      ],
      errors: generateErrors("hello world"),
    },
    {
      code: `<div className={clsx(\`hello-world flex w-full\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
        },
      ],
      errors: generateErrors("hello-world"),
    },
    {
      code: `
      ctl(\`
        px-4
        custom-1
        py-1
        \${
          !isDisabled &&
          \`
            lg:focus:ring-1
            custom-2
            focus:ring-2
          \`
        }
        \${
          isDisabled &&
          \`
            lg:opacity-25
            custom-3
            opacity-50
          \`
        }
      \`)
      `,
      errors: generateErrors("custom-2 custom-3 custom-1"),
    },
    {
      code: `
      <button
      type="button"
      className={classnames(
        ["asdf"],
        [{"qwerty": boolVal}]
      )}
      />`,
      errors: generateErrors("asdf qwerty"),
    },
    {
      code: `
      classnames(
        ["asdf foo"],
        myFlag && [
          "bar",
          someBoolean ? ["baz"] : { "qwerty": someOtherFlag },
        ]
      );`,
      errors: generateErrors("asdf foo bar baz qwerty"),
    },
    {
      code: `<div className="flex skin-summer custom-2 custom-not-whitelisted">incomplete whitelist</div>`,
      options: [
        {
          whitelist: ["skin\\-(summer|xmas)", "custom\\-[1-3]"],
        },
      ],
      errors: generateErrors("custom-not-whitelisted"),
    },
    {
      code: `ctl(\`\${enabled && "px-2 yo flex"}\`)`,
      errors: generateErrors("yo"),
    },
    {
      code: `Style.clsx(\`\${enabled && "px-2 yo flex"}\`)`,
      options: [
        {
          callees: ["Style.clsx"],
        },
      ],
      errors: generateErrors("yo"),
    },
    {
      code: `
      <div
        className={clsx(
          "w-full h-10 rounded",
          name === "white"
            ? "ring-black azerty flex"
            : undefined
        )}
      />
      `,
      errors: generateErrors("azerty"),
    },
    {
      code: `<div className="dark">dark is invalid without darkMode in class</div>`,
      options: [
        {
          config: { darkMode: "media" },
        },
      ],
      errors: generateErrors("dark"),
    },
    ...["myTag", "myTag.subTag", "myTag(SomeComponent)"].flatMap((tag) => [
      {
        code: `
        ${tag}\`
          sm:w-6
          hello
          w-8
          container
          w-12
          world
          flex
          lg:w-4
        \`;`,
        options: [{ tags: ["myTag"] }],
        errors: generateErrors("hello world"),
      },
      {
        code: `
        ${tag}\`
          px-4
          custom-1
          py-1
          \${
            !isDisabled &&
            \`
              lg:focus:ring-1
              custom-2
              focus:ring-2
            \`
          }
          \${
            isDisabled &&
            \`
              lg:opacity-25
              custom-3
              opacity-50
            \`
          }
        \`
        `,
        options: [{ tags: ["myTag"] }],
        errors: generateErrors("custom-2 custom-3 custom-1"),
      },
      {
        code: `${tag}\`custom-1 \${isDisabled ? "custom-2" : "m-4"}\``,
        options: [{ tags: ["myTag"] }],
        errors: generateErrors("custom-2 custom-1"),
      },
    ]),
    {
      code: `
      <div class="bg-red-600 p-10">
        <p class="text-yellow-400 border-2 border-green-600 border-t-nada p-2">border-t-nada</p>
      </div>
      `,
      errors: generateErrors("border-t-nada"),
    },
    {
      code: `
      <div class={\`bg-red-600 p-10\`}>
        <p class={\`text-yellow-400 border-2 border-green-600 border-t-nada p-2\`}>border-t-nada</p>
      </div>
      `,
      errors: generateErrors("border-t-nada"),
    },
    {
      code: `<div class="z-0 sm:z-1000 md:-z-1000 lg:z-[100] xl:z-666 dark:-z-0 sm:dark:z-1000 md:dark:-z-1000 lg:dark:z-[100] xl:dark:-z-666">Z-Index</div>`,
      options: [
        {
          config: {
            theme: {
              extend: {
                zIndex: {
                  0: "0",
                  "-666": "-666",
                  1000: "1000",
                },
              },
            },
          },
        },
      ],
      errors: generateErrors("xl:z-666"),
    },
    {
      code: `
      <div className={'prose-md'}>
        https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/97
      </div>`,
      options: [
        {
          config: {
            plugins: [require("@tailwindcss/typography")],
          },
        },
      ],
      errors: generateErrors("prose-md"),
    },
    {
      code: `
      <p className={\`yolo \${ctl('border-t-nada')}\`}>border-t-nada</p>
      `,
      options: skipClassAttributeOptions,
      errors: generateErrors("border-t-nada"),
    },
    {
      code: `
      <div className="custom-but-allowed bg-404 bg-black text-white md:text-white lg:text-unknown text-color-not-found">
        negated whitelist, will only detect custom classes starting with "text-"
      </div>
      `,
      options: [
        {
          whitelist: ["(?!(bg|text)\\-).*"],
        },
      ],
      errors: generateErrors("bg-404 lg:text-unknown text-color-not-found"),
    },
    {
      code: `
        cva({
          variants: {
            variant: {
              primary: ["sm:w-6 w-8 container w-12 flex lg:w-4 hello"],
              primary: ["sm:w-6 w-8 container w-12 flex lg:w-4 world"],
            },
          },
      });
      `,
      options: [
        {
          callees: ["cva"],
        },
      ],
      errors: generateErrors("hello world"),
    },
    {
      code: `
        cva({
          primary: ["sm:w-6 w-8 container w-12 flex lg:w-4 hello"],
        });
      `,
      options: [
        {
          callees: ["cva"],
        },
      ],
      errors: generateErrors("hello"),
    },
    {
      code: `
      <script>
      export default {
        data() {
          return {
            aClass: 'active',
            bClass: 'text-danger',
            cClass: ctl('tw-c-class')
          }
        }
      }
      </script>
      <template>
        <span class="tw-unknown-class" />
        <span :class="['tw-unknown-class', 'tw-unknown-class-two', aClass]" />
        <span :class="{'tw-unknown-class-key': true, 'tw-unknown-class-key-one tw-unknown-class-key-two': false}" />
        <span :class="ctl('tw-template-ctl')" />
      </template>
      `,
      options: [
        {
          config: {
            prefix: "tw-",
            theme: {
              extend: {},
            },
          },
        },
      ],
      errors: generateErrors(
        "tw-c-class tw-unknown-class tw-unknown-class tw-unknown-class-two tw-unknown-class-key tw-unknown-class-key-one tw-unknown-class-key-two tw-template-ctl"
      ),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <script>
      export default {
        data() {
          return {}
        }
      }
      </script>
      <template>
        <span :class="['text-red-200', {'tw-unknown-class': true, 'tw-unknown-class-two': false}, 'tw-unknown-class-three', 'tw-bg-transparent']" /> 
      </template>
      `,
      options: [
        {
          config: {
            prefix: "tw-",
            theme: {
              extend: {},
            },
          },
        },
      ],
      errors: generateErrors(
        "text-red-200 tw-unknown-class tw-unknown-class-two tw-unknown-class-three"
      ),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div :class="[{'baz': true, 'foo': false}]">Issue #319</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
      errors: generateErrors("baz foo"),
    },
    {
      code: `<template><div :class="['unknown',{'baz': true, 'foo': false}]">Issue #319</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
      errors: generateErrors("unknown baz foo"),
    },
    {
      code: `<template><div :class="['text-red-200','unknown',{'baz': true, 'foo': false}, 'tw-unknown-class']">Issue #319</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
      errors: generateErrors("unknown baz foo tw-unknown-class"),
    },
    {
      code: `<template><div :class="['tw-hidden',{'custom': true, '🧑‍💻': false}, {'text-green-500': true}, 'bg-tw']">Issue #319</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
      errors: generateErrors("tw-hidden custom 🧑‍💻 bg-tw"),
    },
    {
      code: `<template><div :class="[{'baz': true, 'foo': false}]" :prop="['baz', true, 'foo']" :other="['val', {'baz': true, 'foo': false}]">Issue #319</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
      errors: generateErrors("baz foo"),
    },
    {
      code: `<div className="group-hover/edit:unknown-class">Custom group name variant with invalid class name</div>`,
      errors: generateErrors("group-hover/edit:unknown-class"),
    },
    {
      code: `<div className="group-hover/edit:unknown-class">Custom group name variant with invalid class name</div>`,
      errors: generateErrors("group-hover/edit:unknown-class"),
    },
    {
      code: `<div className="peer-checked/draft:unknown-class">Custom peer name variant with invalid class name</div>`,
      errors: generateErrors("peer-checked/draft:unknown-class"),
    },
    {
      code: `<div className="peer-checked/draft:unknown-class">Custom peer name variant with invalid class name</div>`,
      errors: generateErrors("peer-checked/draft:unknown-class"),
    },
    {
      code: `<div fooClass="foo" bazClass="baz">Issue #216</div>`,
      errors: generateErrors("foo baz"),
      options: [
        {
          classRegex: `Class$`,
        },
      ],
    },
    {
      code: `<template><div enterActiveClass="foo" enterFromClass="baz">Issue #216</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
      errors: generateErrors("foo baz"),
      options: [
        {
          classRegex: `class$`,
        },
      ],
    },
    {
      code: `
      // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/193
      const button = cva(["font-semibold", "border", "rounded"], {
        variants: {
          intent: {
            primary: "yolo bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "bg-gray-500 text-black",
          },
          size: {
            small: ["text-sm", "py-1", "px-2"],
            medium: ["text-base", "py-2", "px-4"],
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: ctl("custom"),
          },
        ],
        defaultVariants: {
          intent: "primary",
        },
      });
      `,
      options: [
        {
          callees: ["cva", "ctl"],
        },
      ],
      errors: generateErrors("yolo custom"),
    },
    {
      code: `<div className="px-1\u3000py-2">Full-width space between classes</div>`,
      errors: generateErrors("px-1\u3000py-2"),
    },
    {
      code: `<div className="\u3000px-1 py-2\u3000">Full-width space before and after classes</div>`,
      errors: generateErrors("\u3000px-1 py-2\u3000"),
    },
    {
      code: `<div class="grid grid-flow-col gap-4 grid-rows-supagrid">Subgrid support</div>`,
      errors: generateErrors("grid-rows-supagrid"),
    },
  ],
});
