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
          cssFiles: ["./tests/**/*.css"],
        },
      ],
    },
    {
      code: `
      myTag\`
        sm:w-6
        w-8
        container
        w-12
        flex
        lg:w-4
      \`;`,
      options: [{ tags: ["myTag"] }],
    },
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
      code: `<input class="bg-gray-500 text-white placeholder-current" placeholder="placeholder-current not valid anymore" />`,
      errors: generateErrors("placeholder-current"),
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
      code: `<div class="arbitrary-inset-[123px]">No arbitrary value support without JIT</div>`,
      options: [
        {
          config: {
            prefix: "arbitrary-",
            theme: { inset: {} },
          },
        },
      ],
      errors: generateErrors("arbitrary-inset-[123px]"),
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
    {
      code: `
      myTag\`
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
      myTag\`
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
      code: `
      <div class="bg-red-600 p-10">
        <p class="text-yellow-400 border-2 border-green-600 border-t-nada p-2">border-t-nada</p>
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
  ],
});
