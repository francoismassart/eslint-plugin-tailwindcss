var generateRulesFallback = require('tailwindcss/lib/lib/generateRules').generateRules;

var generatedMap = new Map();

function bigSign(bigIntValue) {
  return (bigIntValue > 0n) - (bigIntValue < 0n);
}

function order(unordered, context) {
  const classNamesWithOrder = [];
  unordered.forEach((className) => {
    let order;
    if (generatedMap.has(className)) {
      order = generatedMap.get(className);
    } else {
      order = generateRulesFallback(new Set([className]), context).sort(([a], [z]) => bigSign(z - a))[0]?.[0] ?? null;
      generatedMap.set(className, order);
    }
    classNamesWithOrder.push([className, order]);
  });

  const classes = classNamesWithOrder
    .sort(([, a], [, z]) => {
      if (a === z) return 0;
      // if (a === null) return options.unknownClassPosition === 'start' ? -1 : 1
      // if (z === null) return options.unknownClassPosition === 'start' ? 1 : -1
      if (a === null) return -1;
      if (z === null) return 1;
      return bigSign(a - z);
    })
    .map(([className]) => className);
  return classes;
}

module.exports = order;
