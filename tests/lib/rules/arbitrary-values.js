/**
 * @fileoverview Detect ambiguous / invalid arbitrary values
 * @description By valid we mean accepted by the JIT compiler even if the injected value is invalid on its CSS usage
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

var config = [
  {
    config: {
      mode: "jit",
      theme: {
        order: {
          "-1": "-1",
          0: "0",
        },
        zIndex: {
          "-1": "-1",
          0: "0",
        },
      },
    },
  },
];

var generateErrors = (classnames) => {
  const errors = [];
  classnames.split(" ").map((classname) => {
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

ruleTester.run("arbitrary-values", rule, {
  valid: [
    {
      code: `
      <div class="object-center object-[0%,10%] object-[10px,-66vh]">
        Valid object-position
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="top-[-325px] right-[50%] w-[762px] h-[0] flex-grow-[var(--some-grow)] flex-shrink-[12] z-[var(--some-z-index)]">
        Should accept the arbitrary values
      </div>`,
      options: [
        {
          config: {
            mode: "jit",
          },
        },
      ],
    },
    {
      code: `
      <div class="z-0 -z-1 z-[auto] z-[inherit] z-[initial] z-[unset] z-[var(--some)] z-[2] z-[-3]">
        Arbitrary values for zIndex
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="flex-auto flex-[2,2,10%] flex-[var(--some)]">
        Arbitrary values for flex
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="flex-shrink flex-shrink-0 flex-shrink-[inherit] flex-shrink-[initial] flex-shrink-[unset] flex-shrink-[var(--some)] flex-shrink-[0.5] flex-shrink-[5]">
        Arbitrary values for positive integers
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="order-0 -order-1 order-[inherit] order-[initial] order-[unset] order-[var(--some)] order-[calc(1+1)] order-[2] order-[-3]">
        Arbitrary values for order
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="placeholder-white placeholder-[#123456aB] placeholder-[#123456] placeholder-[#1234] placeholder-[#123]">
        placeholderColor using #RGB
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="placeholder-white placeholder-[rgb(4,8,15)] placeholder-[rgb(16%,23%,42%)] placeholder-[rgba(23,0,42,0.5)] placeholder-[rgba(10%,20%,30%,100%)] ">
        placeholderColor using rgb[a]()
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="placeholder-white placeholder-[rgba(255,0,0/0.4)] placeholder-[rgba(255,0,0/.4)] placeholder-[rgba(255,0,0/40%)]">
        placeholderColor using rgba(255 0 0 / 0.4)
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="placeholder-white placeholder-[hsl(120,100%,25%)]">
        placeholderColor using hsl
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="placeholder-white placeholder-[var(--some)] placeholder-[color:var(--some)]">
        placeholderColor using var
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="text-white text-[#123456aB] text-[#123456] text-[#1234] text-[#123] text-[rgb(4,8,15)] text-[rgb(16%,23%,42%)] text-[rgba(23,0,42,0.5)] text-[hsl(120,100%,25%)] text-[color:var(--some)]">
        Battle testing valid textColor
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="bg-white/80 text-red-500/25 placeholder-black/50">
        Color opacity shorthands
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="border-[green] border-4 border-[1px] border-[0.5ch] border-[.1em] border-t-[1ex] border-r-[1lh] border-b-[1rem] border-l-[1rlh] border-[length:0] border-[length:thick] border-[length:var(--some)] border-[2vh] border-[2vw] border-[2vmin] border-[2vmax] border-[3px] border-[3mm] border-[3cm] border-[3in] border-[3pt] border-[3pc] border-[3lin] border-[3%] border-[length:calc(50%+10px)] border-[calc(50%+10px)] border-t-[1ex] border-r-[1ex] border-b-[1ex] border-l-[1ex]">
        Valid arbitrary values for border-width
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="divide-[green] divide-x-4 divide-x-[1px] divide-x-[1ch] divide-x-[1em] divide-y-[1ex] divide-y-[1lh] divide-y-[1rem] divide-y-[1rlh] divide-x-[length:0] divide-x-[length:thick] divide-x-[length:var(--some)] divide-x-[calc(50%+10px)] divide-x-[length:calc(50%+10px)]">
        Valid arbitrary values for divide-x-width divide-y-width
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="text-[green] text-xl text-[1px] text-[1ch] text-[1em] text-[1ex] text-[1lh] text-[1rem] text-[1rlh] text-[length:0] text-[length:large] text-[length:var(--some)] text-[length:calc(20px/2)]">
        Valid arbitrary values for fontSize
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="grid gap-4 grid-cols-2 text-[green] gap-[1px] gap-[1ch] gap-[1em] gap-[1ex] gap-[1lh] gap-[1rem] gap-[1rlh] gap-[20px] gap-[var(--some)] gap-[3cap] gap-[3ic] gap-[3vb] gap-[3vi] gap-[calc(50%-10px)]">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="h-4 h-[1px] h-[1ch] h-[1em] h-[1ex] h-[1lh] h-[1rem] h-[1rlh] h-[20px] h-[var(--some)] h-[3cap] h-[3ic] h-[3vb] h-[3vi] h-[calc(50%-10px)]">
        Valid arbitrary values for height
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="leading-4 leading-[1px] leading-[1ch] leading-[1em] leading-[1ex] leading-[1lh] leading-[1rem] leading-[1rlh] leading-[20px] leading-[var(--some)] leading-[3cap] leading-[3ic] leading-[3vb] leading-[3vi] leading-[calc(50%-10px)]">
        Valid arbitrary values for line-height
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="max-h-4 max-h-[1px] max-h-[1ch] max-h-[1em] max-h-[1ex] max-h-[1lh] max-h-[1rem] max-h-[1rlh] max-h-[20px] max-h-[var(--some)] max-h-[3cap] max-h-[3ic] max-h-[3vb] max-h-[3vi] max-h-[calc(50%-10px)]">
        Valid arbitrary values for max-height
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="max-w-full max-w-[1px] max-w-[1ch] max-w-[1em] max-w-[1ex] max-w-[1lh] max-w-[1rem] max-w-[1rlh] max-w-[20px] max-w-[var(--some)] max-w-[3cap] max-w-[3ic] max-w-[3vb] max-w-[3vi] max-w-[calc(50%-10px)]">
        Valid arbitrary values for max-width
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="min-h-full min-h-[1px] min-h-[1ch] min-h-[1em] min-h-[1ex] min-h-[1lh] min-h-[1rem] min-h-[1rlh] min-h-[20px] min-h-[var(--some)] min-h-[3cap] min-h-[3ic] min-h-[3vb] min-h-[3vi] min-h-[calc(50%-10px)]">
        Valid arbitrary values for min-height
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="min-w-full min-w-[1px] min-w-[1ch] min-w-[1em] min-w-[1ex] min-w-[1lh] min-w-[1rem] min-w-[1rlh] min-w-[20px] min-w-[var(--some)] min-w-[3cap] min-w-[3ic] min-w-[3vb] min-w-[3vi] min-w-[calc(50%-10px)]">
        Valid arbitrary values for min-width
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="p-[1px] p-[1ch] p-[1em] p-[1ex] p-[1lh] p-[1rem] p-[1rlh] p-[20px] p-[var(--some)] p-[3cap] p-[3ic] p-[3vb] p-[3vi] p-[calc(50%-10px)]">
        Valid arbitrary values for padding
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="ring-[1px] ring-[1ch] ring-[1em] ring-[1ex] ring-[1lh] ring-[1rem] ring-[1rlh] ring-[20px] ring-[length:var(--some)] ring-[calc(50%-10px)]">
        Valid arbitrary values for ringWidth
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="w-4 w-[1px] w-[1ch] w-[1em] w-[1ex] w-[1lh] w-[1rem] w-[1rlh] w-[20px] w-[var(--some)] w-[3cap] w-[3ic] w-[3vb] w-[3vi] w-[calc(50%-10px)]">
        Valid arbitrary values for width
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="inset-4 inset-[1px] inset-[-3px] inset-[1ch] inset-[1em] inset-[1ex] inset-[1lh] inset-[1rem] inset-[1rlh] inset-[20px] inset-[var(--some)] inset-[3cap] inset-[3ic] inset-[3vb] inset-[3vi] inset-[calc(50%-10px)]">
        Valid arbitrary values for inset
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="tracking-[1px] tracking-[-1px] tracking-[1ch] tracking-[1em] tracking-[1ex] tracking-[1lh] tracking-[1rem] tracking-[1rlh] tracking-[20px] tracking-[var(--some)] tracking-[3cap] tracking-[3ic] tracking-[3vb] tracking-[3vi] tracking-[calc(50%-10px)]">
        Valid arbitrary values for letterSpacing
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="m-[1px] m-[-1px] m-[1ch] m-[1em] m-[1ex] m-[1lh] m-[1rem] m-[1rlh] m-[20px] m-[var(--some)] m-[3cap] m-[3ic] m-[3vb] m-[3vi] m-[calc(50%-10px)]">
        Valid arbitrary values for margin
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="space-x-[1px] space-x-[-1px] space-x-[1ch] space-x-[1em] space-x-[1ex] space-x-[1lh] space-x-[1rem] space-x-[1rlh] space-x-[20px] space-x-[var(--some)] space-x-[3cap] space-x-[3ic] space-x-[3vb] space-x-[3vi] space-x-[calc(50%-10px)]">
        Valid arbitrary values for space
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="opacity-[0] opacity-[0.333] opacity-[.1234] opacity-[1] opacity-[calc(10/100)] opacity-[var(--some)]">
        Valid arbitrary values for opacity
      </div>
      `,
      options: config,
    },
    {
      code: `
      <div class="h-20 w-20 bg-black transform rotate-3 rotate-[calc(15deg+5deg)] rotate-[var(--some)]">rotate</div>
      `,
      options: config,
    },
    {
      code: `
      <div class="grid-rows-2 grid-rows-[list:var(--some)] grid-rows-[var(--some)] auto-cols-auto auto-cols-[calc(10/2)]">
        Invalid grids, cols
      </div>
      `,
      options: config,
    },
    {
      code: `
      <ul class="list-[square] list-[var(--some)] list-[calc(100%)] list-inside pl-10">
        <li>one</li>
        <li>two</li>
        <li>three</li>
      </ul>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-[#00800034] ring-offset-4 ring-offset-[1px] ring-offset-[0.5ch] ring-offset-[.1em] ring-offset-[1ex] ring-offset-[1lh] ring-offset-[1rem] ring-offset-[1rlh] ring-offset-[length:0] ring-offset-[length:thick] ring-offset-[length:var(--some)] ring-offset-[2vh] ring-offset-[2vw] ring-offset-[2vmin] ring-offset-[2vmax] ring-offset-[3px] ring-offset-[3mm] ring-offset-[3cm] ring-offset-[3in] ring-offset-[3pt] ring-offset-[3pc] ring-offset-[3lin] ring-offset-[3%] ring-offset-[length:calc(50%+10px)] ring-offset-[calc(50%+10px)]">valid ring-offset-width</button>
      `,
      options: config,
    },
    {
      code: `
      <div class="rounded-xl rounded-[50%/10%] rounded-[10%,30%,50%,70%] rounded-[var(--some)]">
        Arbitrary values for border-radius
      </div>
      `,
      options: [
        {
          config: {
            mode: "jit",
          },
        },
      ],
    },
    {
      code: `
      <div class="opacity-0 opacity-[.5] opacity-[var(--yolo)] z-[-123] z-[var(--some-z-index)] z-[123] order-[-123] order-[var(--some-order)] order-[123]">
        Testing arbitrary values for: opacity, order, zIndex
      </div>`,
      options: config,
    },
    {
      code: `
      <button class="bg-[#00800034] filter blur-[4] blur-[1px] blur-[0.5ch] blur-[.1em] blur-[1ex] blur-[1lh] blur-[1rem] blur-[1rlh] blur-[2vh] blur-[2vw] blur-[2vmin] blur-[2vmax] blur-[3px] blur-[3mm] blur-[3cm] blur-[3in] blur-[3pt] blur-[3pc] blur-[3lin] blur-[3%] blur-[calc(50%+10px)]">valid blur</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 filter brightness-[4] brightness-[1px] brightness-[0.5ch] brightness-[.1em] brightness-[1ex] brightness-[1lh] brightness-[1rem] brightness-[1rlh] brightness-[2vh] brightness-[2vw] brightness-[2vmin] brightness-[2vmax] brightness-[3px] brightness-[3mm] brightness-[3cm] brightness-[3in] brightness-[3pt] brightness-[3pc] brightness-[3lin] brightness-[33.3%] brightness-[calc(50%+10px)]">valid brightness</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 filter contrast-[4] contrast-[1px] contrast-[0.5ch] contrast-[.1em] contrast-[1ex] contrast-[1lh] contrast-[1rem] contrast-[1rlh] contrast-[2vh] contrast-[2vw] contrast-[2vmin] contrast-[2vmax] contrast-[3px] contrast-[3mm] contrast-[3cm] contrast-[3in] contrast-[3pt] contrast-[3pc] contrast-[3lin] contrast-[33.3%] contrast-[calc(50%+10px)]">valid contrast</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 filter grayscale-[4] grayscale-[1px] grayscale-[0.5ch] grayscale-[.1em] grayscale-[1ex] grayscale-[1lh] grayscale-[1rem] grayscale-[1rlh] grayscale-[2vh] grayscale-[2vw] grayscale-[2vmin] grayscale-[2vmax] grayscale-[3px] grayscale-[3mm] grayscale-[3cm] grayscale-[3in] grayscale-[3pt] grayscale-[3pc] grayscale-[3lin] grayscale-[33.3%] grayscale-[calc(50%+10px)]">valid grayscale</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 filter hue-rotate-[4] hue-rotate-[1px] hue-rotate-[0.5ch] hue-rotate-[.1em] hue-rotate-[1ex] hue-rotate-[1lh] hue-rotate-[1rem] hue-rotate-[1rlh] hue-rotate-[2vh] hue-rotate-[2vw] hue-rotate-[2vmin] hue-rotate-[2vmax] hue-rotate-[3px] hue-rotate-[3mm] hue-rotate-[3cm] hue-rotate-[3in] hue-rotate-[3pt] hue-rotate-[3pc] hue-rotate-[3lin] hue-rotate-[33.3%] hue-rotate-[calc(50%+10px)]">valid hue-rotate</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 filter invert-[4] invert-[1px] invert-[0.5ch] invert-[.1em] invert-[1ex] invert-[1lh] invert-[1rem] invert-[1rlh] invert-[2vh] invert-[2vw] invert-[2vmin] invert-[2vmax] invert-[3px] invert-[3mm] invert-[3cm] invert-[3in] invert-[3pt] invert-[3pc] invert-[3lin] invert-[33.3%] invert-[calc(50%+10px)]">valid invert</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 filter saturate-[4] saturate-[1px] saturate-[0.5ch] saturate-[.1em] saturate-[1ex] saturate-[1lh] saturate-[1rem] saturate-[1rlh] saturate-[2vh] saturate-[2vw] saturate-[2vmin] saturate-[2vmax] saturate-[3px] saturate-[3mm] saturate-[3cm] saturate-[3in] saturate-[3pt] saturate-[3pc] saturate-[3lin] saturate-[33.3%] saturate-[calc(50%+10px)]">valid saturate</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 filter sepia-[4] sepia-[1px] sepia-[0.5ch] sepia-[.1em] sepia-[1ex] sepia-[1lh] sepia-[1rem] sepia-[1rlh] sepia-[2vh] sepia-[2vw] sepia-[2vmin] sepia-[2vmax] sepia-[3px] sepia-[3mm] sepia-[3cm] sepia-[3in] sepia-[3pt] sepia-[3pc] sepia-[3lin] sepia-[33.3%] sepia-[calc(50%+10px)]">valid sepia</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 backdrop-filter backdrop-blur-[4] backdrop-blur-[1px] backdrop-blur-[0.5ch] backdrop-blur-[.1em] backdrop-blur-[1ex] backdrop-blur-[1lh] backdrop-blur-[1rem] backdrop-blur-[1rlh] backdrop-blur-[2vh] backdrop-blur-[2vw] backdrop-blur-[2vmin] backdrop-blur-[2vmax] backdrop-blur-[3px] backdrop-blur-[3mm] backdrop-blur-[3cm] backdrop-blur-[3in] backdrop-blur-[3pt] backdrop-blur-[3pc] backdrop-blur-[3lin] backdrop-blur-[33.3%] backdrop-blur-[calc(50%+10px)]">valid backdrop-blur</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 backdrop-filter backdrop-brightness-[4] backdrop-brightness-[1px] backdrop-brightness-[0.5ch] backdrop-brightness-[.1em] backdrop-brightness-[1ex] backdrop-brightness-[1lh] backdrop-brightness-[1rem] backdrop-brightness-[1rlh] backdrop-brightness-[2vh] backdrop-brightness-[2vw] backdrop-brightness-[2vmin] backdrop-brightness-[2vmax] backdrop-brightness-[3px] backdrop-brightness-[3mm] backdrop-brightness-[3cm] backdrop-brightness-[3in] backdrop-brightness-[3pt] backdrop-brightness-[3pc] backdrop-brightness-[3lin] backdrop-brightness-[33.3%] backdrop-brightness-[calc(50%+10px)]">valid backdrop-brightness</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 backdrop-filter backdrop-contrast-[4] backdrop-contrast-[1px] backdrop-contrast-[0.5ch] backdrop-contrast-[.1em] backdrop-contrast-[1ex] backdrop-contrast-[1lh] backdrop-contrast-[1rem] backdrop-contrast-[1rlh] backdrop-contrast-[2vh] backdrop-contrast-[2vw] backdrop-contrast-[2vmin] backdrop-contrast-[2vmax] backdrop-contrast-[3px] backdrop-contrast-[3mm] backdrop-contrast-[3cm] backdrop-contrast-[3in] backdrop-contrast-[3pt] backdrop-contrast-[3pc] backdrop-contrast-[3lin] backdrop-contrast-[33.3%] backdrop-contrast-[calc(50%+10px)]">valid backdrop-contrast</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 backdrop-filter backdrop-grayscale-[4] backdrop-grayscale-[1px] backdrop-grayscale-[0.5ch] backdrop-grayscale-[.1em] backdrop-grayscale-[1ex] backdrop-grayscale-[1lh] backdrop-grayscale-[1rem] backdrop-grayscale-[1rlh] backdrop-grayscale-[2vh] backdrop-grayscale-[2vw] backdrop-grayscale-[2vmin] backdrop-grayscale-[2vmax] backdrop-grayscale-[3px] backdrop-grayscale-[3mm] backdrop-grayscale-[3cm] backdrop-grayscale-[3in] backdrop-grayscale-[3pt] backdrop-grayscale-[3pc] backdrop-grayscale-[3lin] backdrop-grayscale-[33.3%] backdrop-grayscale-[calc(50%+10px)]">valid backdrop-grayscale</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 backdrop-filter backdrop-hue-rotate-[4] backdrop-hue-rotate-[1px] backdrop-hue-rotate-[0.5ch] backdrop-hue-rotate-[.1em] backdrop-hue-rotate-[1ex] backdrop-hue-rotate-[1lh] backdrop-hue-rotate-[1rem] backdrop-hue-rotate-[1rlh] backdrop-hue-rotate-[2vh] backdrop-hue-rotate-[2vw] backdrop-hue-rotate-[2vmin] backdrop-hue-rotate-[2vmax] backdrop-hue-rotate-[3px] backdrop-hue-rotate-[3mm] backdrop-hue-rotate-[3cm] backdrop-hue-rotate-[3in] backdrop-hue-rotate-[3pt] backdrop-hue-rotate-[3pc] backdrop-hue-rotate-[3lin] backdrop-hue-rotate-[33.3%] backdrop-hue-rotate-[calc(50%+10px)]">valid backdrop-hue-rotate</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 backdrop-filter backdrop-invert-[4] backdrop-invert-[1px] backdrop-invert-[0.5ch] backdrop-invert-[.1em] backdrop-invert-[1ex] backdrop-invert-[1lh] backdrop-invert-[1rem] backdrop-invert-[1rlh] backdrop-invert-[2vh] backdrop-invert-[2vw] backdrop-invert-[2vmin] backdrop-invert-[2vmax] backdrop-invert-[3px] backdrop-invert-[3mm] backdrop-invert-[3cm] backdrop-invert-[3in] backdrop-invert-[3pt] backdrop-invert-[3pc] backdrop-invert-[3lin] backdrop-invert-[33.3%] backdrop-invert-[calc(50%+10px)]">valid backdrop-invert</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 backdrop-filter backdrop-opacity-[4] backdrop-opacity-[1px] backdrop-opacity-[0.5ch] backdrop-opacity-[.1em] backdrop-opacity-[1ex] backdrop-opacity-[1lh] backdrop-opacity-[1rem] backdrop-opacity-[1rlh] backdrop-opacity-[2vh] backdrop-opacity-[2vw] backdrop-opacity-[2vmin] backdrop-opacity-[2vmax] backdrop-opacity-[3px] backdrop-opacity-[3mm] backdrop-opacity-[3cm] backdrop-opacity-[3in] backdrop-opacity-[3pt] backdrop-opacity-[3pc] backdrop-opacity-[3lin] backdrop-opacity-[33.3%] backdrop-opacity-[calc(50%+10px)]">valid backdrop-opacity</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 backdrop-filter backdrop-saturate-[4] backdrop-saturate-[1px] backdrop-saturate-[0.5ch] backdrop-saturate-[.1em] backdrop-saturate-[1ex] backdrop-saturate-[1lh] backdrop-saturate-[1rem] backdrop-saturate-[1rlh] backdrop-saturate-[2vh] backdrop-saturate-[2vw] backdrop-saturate-[2vmin] backdrop-saturate-[2vmax] backdrop-saturate-[3px] backdrop-saturate-[3mm] backdrop-saturate-[3cm] backdrop-saturate-[3in] backdrop-saturate-[3pt] backdrop-saturate-[3pc] backdrop-saturate-[3lin] backdrop-saturate-[33.3%] backdrop-saturate-[calc(50%+10px)]">valid backdrop-saturate</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="bg-red-500 backdrop-filter backdrop-sepia-[4] backdrop-sepia-[1px] backdrop-sepia-[0.5ch] backdrop-sepia-[.1em] backdrop-sepia-[1ex] backdrop-sepia-[1lh] backdrop-sepia-[1rem] backdrop-sepia-[1rlh] backdrop-sepia-[2vh] backdrop-sepia-[2vw] backdrop-sepia-[2vmin] backdrop-sepia-[2vmax] backdrop-sepia-[3px] backdrop-sepia-[3mm] backdrop-sepia-[3cm] backdrop-sepia-[3in] backdrop-sepia-[3pt] backdrop-sepia-[3pc] backdrop-sepia-[3lin] backdrop-sepia-[33.3%] backdrop-sepia-[calc(50%+10px)]">valid backdrop-sepia</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="duration-[4] duration-[4s] duration-[444ms] duration-[1px] duration-[0.5ch] duration-[.1em] duration-[1ex] duration-[1lh] duration-[1rem] duration-[1rlh] duration-[2vh] duration-[2vw] duration-[2vmin] duration-[2vmax] duration-[3px] duration-[3mm] duration-[3cm] duration-[3in] duration-[3pt] duration-[3pc] duration-[3lin] duration-[33.3%] duration-[calc(50%+10px)]">valid duration</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="transition ease-in duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ease-[var(--some)] ease-[1px]">Accepted ease by the JIT</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="transition delay-150 duration-300 ease-in-out delay-[1s] delay-[var(--some)]">Delay</button>
      `,
      options: config,
    },
    {
      code: `
      <button class="animate-spin animate-[1s] animate-[var(--some)]">Animate</button>
      `,
      options: config,
    },
    {
      code: `
      <div class="transform rotate-45 h-20 w-20 bg-green-600 origin-top-left origin-[var(--some)] origin-[20%] origin-[90%,90%]">origin</div>
      `,
      options: config,
    },
    {
      code: `
      <div class="transform scale-50 scale-0 scale-[90%] scale-[5]">scale</div>
      `,
      options: config,
    },
    {
      code: `
      <div class="transform scale-50 scale-0 scale-[90%] scale-[5]">scale</div>
      `,
      options: config,
    },
    {
      code: `
      <div class="transform translate-y-6 translate-y-[10px] translate-y-[-10px]  translate-y-[1%]">translate</div>
      `,
      options: config,
    },
    {
      code: `
      <div class="transform skew-y-6 skew-y-[10px] skew-y-[-10px] skew-y-[1%]">skew</div>
      `,
      options: config,
    },
    {
      code: `
      <div class="cursor-auto cursor-['yolo'] cursor-[1px]">Cursor</div>
      `,
      options: config,
    },
    {
      code: `
      <button class="outline-black outline-['2px,solid,red'] outline-[var(--some)]">outline</button>
      `,
      options: config,
    },
    {
      code: `
      <svg class="fill-current fill-[red] fill-[#ABCDEF] fill-[var(--some)] fill-[color:var(--some)] fill-['yolo']"></svg>
      `,
      options: config,
    },
    {
      code: `
      <svg class="stroke-current stroke-[red] stroke-[color:var(--some)]"></svg>
      `,
      options: config,
    },
    {
      code: `
      <div class="stroke-[green] stroke-1 stroke-[1px] stroke-[0.5ch] stroke-[.1em] stroke-[length:0] stroke-[length:thick] stroke-[length:var(--some)] stroke-[2vh] stroke-[2vw] stroke-[2vmin] stroke-[2vmax] stroke-[3px] stroke-[3mm] stroke-[3cm] stroke-[3in] stroke-[3pt] stroke-[3pc] stroke-[3lin] stroke-[3%] stroke-[length:calc(50%+10px)] stroke-[calc(50%+10px)]">
        Valid arbitrary values for stroke-width
      </div>
      `,
      options: config,
    },
  ],

  invalid: [
    {
      code: `
      <div class="bg-[var(--donno)]">
        Invalid bg-color
      </div>
      `,
      options: config,
      errors: generateErrors("bg-[var(--donno)]"),
    },
    {
      code: `
      <div class="object-[angle:0%,10%] object-[color:0%,10%] object-[length:0%,10%]">
        Invalid object-position
      </div>
      `,
      options: config,
      errors: generateErrors("object-[angle:0%,10%] object-[color:0%,10%] object-[length:0%,10%]"),
    },
    {
      code: `
      <div class="placeholder-[hsla(240,100%,50%,0.7]">
        Unsupported placeholderColor using hsla
      </div>
      `,
      options: config,
      errors: generateErrors("placeholder-[hsla(240,100%,50%,0.7]"),
    },
    {
      code: `
      <div class="text-white text-[rgba(10%,20%,30%,100%)] text-[rgba(255,0,0/0.4)] text-[rgba(255,0,0/.4)] text-[rgba(255,0,0/40%)] text-[var(--some)]">
        Battle testing invalid textColor
      </div>
      `,
      options: config,
      errors: generateErrors(
        "text-[rgba(10%,20%,30%,100%)] text-[rgba(255,0,0/0.4)] text-[rgba(255,0,0/.4)] text-[rgba(255,0,0/40%)] text-[var(--some)]"
      ),
    },
    {
      code: `
      <div class="border-[0] border-[1cap] border-[1ic] border-[thick] border-[var(--some)] border-[1vb] border-[1vi]">
        Invalid / ambiguous arbitrary values for border-width
      </div>
      `,
      options: config,
      errors: generateErrors(
        "border-[0] border-[1cap] border-[1ic] border-[thick] border-[var(--some)] border-[1vb] border-[1vi]"
      ),
    },
    {
      code: `
      <div class="divide-x-[0] divide-x-[1cap] divide-x-[1ic] divide-x-[thick] divide-y-[var(--some)]">
        Invalid / ambiguous arbitrary values for divide-width
      </div>
      `,
      options: config,
      errors: generateErrors("divide-x-[0] divide-x-[1cap] divide-x-[1ic] divide-x-[thick] divide-y-[var(--some)]"),
    },
    {
      code: `
      <div class="text-[0] text-[1cap] text-[1ic] text-[large] text-[var(--some)]">
        Invalid / ambiguous arbitrary values for fontSize
      </div>
      `,
      options: config,
      errors: generateErrors("text-[0] text-[1cap] text-[1ic] text-[large] text-[var(--some)]"),
    },
    {
      code: `
      <div class="gap-[length:var(--some)] gap-[length:20px]">
        Invalid arbitrary values for gap
      </div>
      `,
      options: config,
      errors: generateErrors("gap-[length:var(--some)] gap-[length:20px]"),
    },
    {
      code: `
      <div class="h-[length:var(--some)] h-[length:20px]">
        Invalid arbitrary values for height
      </div>
      `,
      options: config,
      errors: generateErrors("h-[length:var(--some)] h-[length:20px]"),
    },
    {
      code: `
      <div class="leading-[length:var(--some)] leading-[length:20px]">
        Invalid arbitrary values for line-height
      </div>
      `,
      options: config,
      errors: generateErrors("leading-[length:var(--some)] leading-[length:20px]"),
    },
    {
      code: `
      <div class="max-h-[length:var(--some)] max-h-[length:20px]">
        Invalid arbitrary values for max-height
      </div>
      `,
      options: config,
      errors: generateErrors("max-h-[length:var(--some)] max-h-[length:20px]"),
    },
    {
      code: `
      <div class="max-w-[length:var(--some)] max-w-[length:20px]">
        Invalid arbitrary values for max-width
      </div>
      `,
      options: config,
      errors: generateErrors("max-w-[length:var(--some)] max-w-[length:20px]"),
    },
    {
      code: `
      <div class="min-h-[length:var(--some)] min-h-[length:20px]">
        Invalid arbitrary values for min-height
      </div>
      `,
      options: config,
      errors: generateErrors("min-h-[length:var(--some)] min-h-[length:20px]"),
    },
    {
      code: `
      <div class="min-w-[length:var(--some)] min-w-[length:20px]">
        Invalid arbitrary values for min-width
      </div>
      `,
      options: config,
      errors: generateErrors("min-w-[length:var(--some)] min-w-[length:20px]"),
    },
    {
      code: `
      <div class="p-[length:var(--some)] p-[length:20px]">
        Invalid arbitrary values for padding
      </div>
      `,
      options: config,
      errors: generateErrors("p-[length:var(--some)] p-[length:20px]"),
    },
    {
      code: `
      <div class="ring-[var(--some)] ring-[3cap] ring-[3ic] ring-[3vb] ring-[3vi]">
        Invalid arbitrary values for ringWidth
      </div>
      `,
      options: config,
      errors: generateErrors("ring-[var(--some)] ring-[3cap] ring-[3ic] ring-[3vb] ring-[3vi]"),
    },
    {
      code: `
      <div class="w-[length:var(--some)] w-[length:20px]">
        Invalid arbitrary values for width
      </div>
      `,
      options: config,
      errors: generateErrors("w-[length:var(--some)] w-[length:20px]"),
    },
    {
      code: `
      <div class="inset-[length:var(--some)] inset-[length:20px]">
        Invalid arbitrary values for inset
      </div>
      `,
      options: config,
      errors: generateErrors("inset-[length:var(--some)] inset-[length:20px]"),
    },
    {
      code: `
      <div class="tracking-[length:var(--some)] tracking-[length:20px]">
        Invalid arbitrary values for letterSpacing
      </div>
      `,
      options: config,
      errors: generateErrors("tracking-[length:var(--some)] tracking-[length:20px]"),
    },
    {
      code: `
      <div class="m-[length:var(--some)] m-[length:20px]">
        Invalid arbitrary values for margin
      </div>
      `,
      options: config,
      errors: generateErrors("m-[length:var(--some)] m-[length:20px]"),
    },
    {
      code: `
      <div class="space-x-[length:var(--some)] space-x-[length:20px]">
        Invalid arbitrary values for space
      </div>
      `,
      options: config,
      errors: generateErrors("space-x-[length:var(--some)] space-x-[length:20px]"),
    },
    {
      code: `
      <div class="opacity-[-10] opacity-[1.333]">
        Invalid arbitrary values for opacity
      </div>
      `,
      options: config,
      errors: generateErrors("opacity-[-10] opacity-[1.333]"),
    },
    {
      code: `
      <div class="rotate-[angle:5deg] rotate-[66]">
      Invalid arbitrary values for rotate
      </div>
      `,
      options: config,
      errors: generateErrors("rotate-[angle:5deg] rotate-[66]"),
    },
    {
      code: `
      <ul class="list-[angle:var(--some)] list-[list:var(--some)] list-[length:var(--some)] list-[color:var(--some)]">
        <li>invalid</li>
        <li>nope</li>
        <li>no</li>
      </ul>
      `,
      options: config,
      errors: generateErrors(
        "list-[angle:var(--some)] list-[list:var(--some)] list-[length:var(--some)] list-[color:var(--some)]"
      ),
    },
    {
      code: `
      <button class="ring-offset-[4]">invalid ring-offset-width</button>
      `,
      options: config,
      errors: generateErrors("ring-offset-[4]"),
    },
    {
      code: `
      <button class="filter brightness-[length:0] brightness-[length:thick] brightness-[length:var(--some)] brightness-[length:calc(50%+10px)]">Invalid brightness</button> 
      `,
      options: config,
      errors: generateErrors(
        "brightness-[length:0] brightness-[length:thick] brightness-[length:var(--some)] brightness-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="filter contrast-[length:0] contrast-[length:thick] contrast-[length:var(--some)] contrast-[length:calc(50%+10px)]">Invalid contrast</button> 
      `,
      options: config,
      errors: generateErrors(
        "contrast-[length:0] contrast-[length:thick] contrast-[length:var(--some)] contrast-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="filter grayscale-[length:0] grayscale-[length:thick] grayscale-[length:var(--some)] grayscale-[length:calc(50%+10px)]">Invalid grayscale</button> 
      `,
      options: config,
      errors: generateErrors(
        "grayscale-[length:0] grayscale-[length:thick] grayscale-[length:var(--some)] grayscale-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="filter hue-rotate-[length:0] hue-rotate-[length:thick] hue-rotate-[length:var(--some)] hue-rotate-[length:calc(50%+10px)]">Invalid hue-rotate</button> 
      `,
      options: config,
      errors: generateErrors(
        "hue-rotate-[length:0] hue-rotate-[length:thick] hue-rotate-[length:var(--some)] hue-rotate-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="filter invert-[length:0] invert-[length:thick] invert-[length:var(--some)] invert-[length:calc(50%+10px)]">Invalid invert</button> 
      `,
      options: config,
      errors: generateErrors(
        "invert-[length:0] invert-[length:thick] invert-[length:var(--some)] invert-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="filter saturate-[length:0] saturate-[length:thick] saturate-[length:var(--some)] saturate-[length:calc(50%+10px)]">Invalid saturate</button> 
      `,
      options: config,
      errors: generateErrors(
        "saturate-[length:0] saturate-[length:thick] saturate-[length:var(--some)] saturate-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="filter sepia-[length:0] sepia-[length:thick] sepia-[length:var(--some)] sepia-[length:calc(50%+10px)]">Invalid sepia</button> 
      `,
      options: config,
      errors: generateErrors(
        "sepia-[length:0] sepia-[length:thick] sepia-[length:var(--some)] sepia-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="backdrop-filter backdrop-blur-[length:0] backdrop-blur-[length:thick] backdrop-blur-[length:var(--some)] backdrop-blur-[length:calc(50%+10px)]">Invalid backdrop-blur</button> 
      `,
      options: config,
      errors: generateErrors(
        "backdrop-blur-[length:0] backdrop-blur-[length:thick] backdrop-blur-[length:var(--some)] backdrop-blur-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="backdrop-filter backdrop-brightness-[length:0] backdrop-brightness-[length:thick] backdrop-brightness-[length:var(--some)] backdrop-brightness-[length:calc(50%+10px)]">Invalid backdrop-brightness</button> 
      `,
      options: config,
      errors: generateErrors(
        "backdrop-brightness-[length:0] backdrop-brightness-[length:thick] backdrop-brightness-[length:var(--some)] backdrop-brightness-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="backdrop-filter backdrop-contrast-[length:0] backdrop-contrast-[length:thick] backdrop-contrast-[length:var(--some)] backdrop-contrast-[length:calc(50%+10px)]">Invalid backdrop-contrast</button> 
      `,
      options: config,
      errors: generateErrors(
        "backdrop-contrast-[length:0] backdrop-contrast-[length:thick] backdrop-contrast-[length:var(--some)] backdrop-contrast-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="backdrop-filter backdrop-grayscale-[length:0] backdrop-grayscale-[length:thick] backdrop-grayscale-[length:var(--some)] backdrop-grayscale-[length:calc(50%+10px)]">Invalid backdrop-grayscale</button> 
      `,
      options: config,
      errors: generateErrors(
        "backdrop-grayscale-[length:0] backdrop-grayscale-[length:thick] backdrop-grayscale-[length:var(--some)] backdrop-grayscale-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="backdrop-filter backdrop-hue-rotate-[length:0] backdrop-hue-rotate-[length:thick] backdrop-hue-rotate-[length:var(--some)] backdrop-hue-rotate-[length:calc(50%+10px)]">Invalid backdrop-hue-rotate</button> 
      `,
      options: config,
      errors: generateErrors(
        "backdrop-hue-rotate-[length:0] backdrop-hue-rotate-[length:thick] backdrop-hue-rotate-[length:var(--some)] backdrop-hue-rotate-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="backdrop-filter backdrop-invert-[length:0] backdrop-invert-[length:thick] backdrop-invert-[length:var(--some)] backdrop-invert-[length:calc(50%+10px)]">Invalid backdrop-invert</button> 
      `,
      options: config,
      errors: generateErrors(
        "backdrop-invert-[length:0] backdrop-invert-[length:thick] backdrop-invert-[length:var(--some)] backdrop-invert-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="backdrop-filter backdrop-opacity-[length:0] backdrop-opacity-[length:thick] backdrop-opacity-[length:var(--some)] backdrop-opacity-[length:calc(50%+10px)]">Invalid backdrop-opacity</button> 
      `,
      options: config,
      errors: generateErrors(
        "backdrop-opacity-[length:0] backdrop-opacity-[length:thick] backdrop-opacity-[length:var(--some)] backdrop-opacity-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="backdrop-filter backdrop-saturate-[length:0] backdrop-saturate-[length:thick] backdrop-saturate-[length:var(--some)] backdrop-saturate-[length:calc(50%+10px)]">Invalid backdrop-saturate</button> 
      `,
      options: config,
      errors: generateErrors(
        "backdrop-saturate-[length:0] backdrop-saturate-[length:thick] backdrop-saturate-[length:var(--some)] backdrop-saturate-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="backdrop-filter backdrop-sepia-[length:0] backdrop-sepia-[length:thick] backdrop-sepia-[length:var(--some)] backdrop-sepia-[length:calc(50%+10px)]">Invalid backdrop-sepia</button> 
      `,
      options: config,
      errors: generateErrors(
        "backdrop-sepia-[length:0] backdrop-sepia-[length:thick] backdrop-sepia-[length:var(--some)] backdrop-sepia-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="duration-[length:0] duration-[length:thick] duration-[length:var(--some)] duration-[length:calc(50%+10px)]">Invalid duration</button> 
      `,
      options: config,
      errors: generateErrors(
        "duration-[length:0] duration-[length:thick] duration-[length:var(--some)] duration-[length:calc(50%+10px)]"
      ),
    },
    {
      code: `
      <button class="transition ease-in duration-700 ease-[length:cubic-bezier(0.19,1,0.22,1)] ease-[list:1px]">Accepted ease by the JIT</button>
      `,
      options: config,
      errors: generateErrors("ease-[length:cubic-bezier(0.19,1,0.22,1)] ease-[list:1px]"),
    },
    {
      code: `
      <button class="transition delay-150 duration-300 ease-in-out delay-[length:1s] delay-[list:var(--some)]">Delay</button>
      `,
      options: config,
      errors: generateErrors("delay-[length:1s] delay-[list:var(--some)]"),
    },
    {
      code: `
      <button class="animate-spin animate-[list:1s] animate-[length:var(--some)]">Animate</button>
      `,
      options: config,
      errors: generateErrors("animate-[list:1s] animate-[length:var(--some)]"),
    },
    {
      code: `
      <div class="transform rotate-45 h-20 w-20 bg-green-600 origin-top-left origin-[list:top,right] origin-[list:10%]">origin</div>
      `,
      options: config,
      errors: generateErrors("origin-[list:top,right] origin-[list:10%]"),
    },
    {
      code: `
      <div class="transform scale-50 scale-0 scale-[length:90%] scale-[length:0.5]">scale</div>
      `,
      options: config,
      errors: generateErrors("scale-[length:90%] scale-[length:0.5]"),
    },
    {
      code: `
      <div class="transform translate-y-6 translate-y-[length:10px] translate-y-[list:-10px]">translate</div>
      `,
      options: config,
      errors: generateErrors("translate-y-[length:10px] translate-y-[list:-10px]"),
    },
    {
      code: `
      <div class="transform translate-y-6 translate-y-[length:10px] translate-y-[list:-10px]">translate</div>
      `,
      options: config,
      errors: generateErrors("translate-y-[length:10px] translate-y-[list:-10px]"),
    },
    {
      code: `
      <div class="transform skew-y-6 skew-y-[length:10px] skew-y-[list:-10px]">skew</div>
      `,
      options: config,
      errors: generateErrors("skew-y-[length:10px] skew-y-[list:-10px]"),
    },
    {
      code: `
      <div class="cursor-auto cursor-[list:'yolo','ftw'] cursor-[length:1px]">Cursor</div>
      `,
      options: config,
      errors: generateErrors("cursor-[list:'yolo','ftw'] cursor-[length:1px]"),
    },
    {
      code: `
      <button class="outline-black outline-[list:2px,solid,red] outline-[list:var(--some)]">outline</button>
      `,
      options: config,
      errors: generateErrors("outline-[list:2px,solid,red] outline-[list:var(--some)]"),
    },
    {
      code: `
      <svg class="fill-current fill-[red] fill-[length:#ABCDEF] fill-[list:var(--some)] fill-[angle:var(--some)]"></svg>
      `,
      options: config,
      errors: generateErrors("fill-[length:#ABCDEF] fill-[list:var(--some)] fill-[angle:var(--some)]"),
    },
    {
      code: `
      <svg class="stroke-[var(--some)] stroke-['yolo'] stroke-[angle:var(--some)]"></svg>
      `,
      options: config,
      errors: generateErrors("stroke-[var(--some)] stroke-['yolo'] stroke-[angle:var(--some)]"),
    },
    {
      code: `
      <div class="stroke-[0] stroke-[1cap] stroke-[1ic] stroke-[thick] stroke-[var(--some)] stroke-[1vb] stroke-[1vi]">
        Invalid / ambiguous arbitrary values for stroke-width
      </div>
      `,
      options: config,
      errors: generateErrors(
        "stroke-[0] stroke-[1cap] stroke-[1ic] stroke-[thick] stroke-[var(--some)] stroke-[1vb] stroke-[1vi]"
      ),
    },
  ],
});
