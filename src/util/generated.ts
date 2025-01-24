import { generateRules as generateRulesFallback } from 'tailwindcss/lib/lib/generateRules';

function generate(className, context) {
  // const order = generateRulesFallback(new Set([className]), context).sort(([a], [z]) => bigSign(z - a))[0]?.[0] ?? null;
  const gen = generateRulesFallback(new Set([className]), context);
  // console.debug(gen);
  return gen;
}

export default generate;
