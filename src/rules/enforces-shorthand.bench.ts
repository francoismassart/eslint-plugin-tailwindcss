import { bench, describe } from "vitest";

describe("Generating shorthand for margin combining `-ml-foo` + `-mr-foo` into `-mx-foo`", () => {
  const negative = "-";
  const suffixValue = "-foo";
  const combo = ["ml", "mr"];
  const totalComboParts = combo.length;
  const classicForLoop = () => {
    // e.g. `-mx-foo` for the combo `["ml", "mr"]` with the key `mx`
    const longhandClasses: Array<string> = Array.from({
      length: totalComboParts,
    });
    for (let index = 0; index < totalComboParts; index++) {
      longhandClasses[index] = `${negative}${combo[index]}${suffixValue}`;
    }
    return longhandClasses;
  };
  const arrayFromWithMap = () => {
    // e.g. `-mx-foo` for the combo `["ml", "mr"]` with the key `mx`
    const longhandClasses: Array<string> = Array.from({
      length: totalComboParts,
    }).map((_, index) => `${negative}${combo[index]}${suffixValue}`);
    return longhandClasses;
  };
  const arrayFromWithCallback = () => {
    // e.g. `-mx-foo` for the combo `["ml", "mr"]` with the key `mx`
    const longhandClasses: Array<string> = Array.from(
      {
        length: totalComboParts,
      },
      (_, index) => `${negative}${combo[index]}${suffixValue}`,
    );
    return longhandClasses;
  };
  bench("classic", () => {
    classicForLoop();
  });
  bench("map", () => {
    arrayFromWithMap();
  });
  bench("callback", () => {
    arrayFromWithCallback();
  });
});
