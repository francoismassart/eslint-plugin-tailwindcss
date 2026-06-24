// case /^scroll-(?:m|mx|my|ms|me|mbs|mbe|mt|mr|mb|ml)-/.test(baseClass): {

import { bench, describe } from "vitest";

describe("Faster way to find which starts with a single possibility", () => {
  const candidates =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc facilisis diam libero, sit amet mollis nisl vestibulum sed. Quisque imperdiet enim id dui porttitor, eget maximus quam pharetra. Nunc maximus porttitor libero, non consectetur lectus semper a. Aenean diam elit, sollicitudin eget neque quis, venenatis scelerisque erat. Proin bibendum risus a urna venenatis, eget feugiat libero dapibus. Mauris cursus neque metus, eu interdum sem faucibus ut. Sed a eros est. Proin porta accumsan vestibulum. Praesent mattis ultricies ante, ac ultrices libero luctus sollicitudin. Praesent in fringilla velit, elementum vestibulum dolor. Duis gravida elementum orci. Aliquam non lorem sem. In laoreet mi vitae est vehicula auctor. Quisque ut erat sed mauris dictum vehicula ac et nibh. Sed imperdiet libero eu felis tincidunt blandit vel at velit."
      .replace(".", "")
      .split(" ");
  const usingSingleRegex = () => {
    for (const candidate of candidates) {
      if (/^(?:px)-/.test(candidate)) {
        continue;
      }
    }
  };
  const usingSingleStartsWith = () => {
    for (const candidate of candidates) {
      if (candidate.startsWith("px-")) {
        continue;
      }
    }
  };

  bench("usingSingleRegex", () => {
    usingSingleRegex();
  });
  bench("usingSingleStartsWith", () => {
    usingSingleStartsWith();
  });
});

describe("Faster way to find which starts with multiple possibilities", () => {
  const candidates =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc facilisis diam libero, sit amet mollis nisl vestibulum sed. Quisque imperdiet enim id dui porttitor, eget maximus quam pharetra. Nunc maximus porttitor libero, non consectetur lectus semper a. Aenean diam elit, sollicitudin eget neque quis, venenatis scelerisque erat. Proin bibendum risus a urna venenatis, eget feugiat libero dapibus. Mauris cursus neque metus, eu interdum sem faucibus ut. Sed a eros est. Proin porta accumsan vestibulum. Praesent mattis ultricies ante, ac ultrices libero luctus sollicitudin. Praesent in fringilla velit, elementum vestibulum dolor. Duis gravida elementum orci. Aliquam non lorem sem. In laoreet mi vitae est vehicula auctor. Quisque ut erat sed mauris dictum vehicula ac et nibh. Sed imperdiet libero eu felis tincidunt blandit vel at velit."
      .replace(".", "")
      .split(" ");
  const usingComplexRegex = () => {
    for (const candidate of candidates) {
      if (/^(?:p|px|py|ps|pe|pbs|pbe|pt|pr|pb|pl)-/.test(candidate)) {
        continue;
      }
    }
  };
  const usingMultipleStartsWith = () => {
    for (const candidate of candidates) {
      if (
        candidate.startsWith("p-") ||
        candidate.startsWith("px-") ||
        candidate.startsWith("py-") ||
        candidate.startsWith("ps-") ||
        candidate.startsWith("pe-") ||
        candidate.startsWith("pbs-") ||
        candidate.startsWith("pbe-") ||
        candidate.startsWith("pt-") ||
        candidate.startsWith("pr-") ||
        candidate.startsWith("pb-") ||
        candidate.startsWith("pl-")
      ) {
        continue;
      }
    }
  };

  bench("usingComplexRegex", () => {
    usingComplexRegex();
  });
  bench("usingMultipleStartsWith", () => {
    usingMultipleStartsWith();
  });
});
