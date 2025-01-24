import classnamesOrder from './classnames-order';
import enforcesNegativeArbitraryValues from './enforces-negative-arbitrary-values';
import enforcesShorthand from './enforces-shorthand';
import migrationFromTailwind2 from './migration-from-tailwind-2';
import noArbitraryValue from './no-arbitrary-value';
import noContradictingClassname from './no-contradicting-classname';
import noCustomClassname from './no-custom-classname';
import noUnnecessaryArbitraryValue from './no-unnecessary-arbitrary-value';

export const rules = {
  'classnames-order': classnamesOrder,
  'enforces-negative-arbitrary-values': enforcesNegativeArbitraryValues,
  'enforces-shorthand': enforcesShorthand,
  'migration-from-tailwind-2': migrationFromTailwind2,
  'no-arbitrary-value': noArbitraryValue,
  'no-contradicting-classname': noContradictingClassname,
  'no-custom-classname': noCustomClassname,
  'no-unnecessary-arbitrary-value': noUnnecessaryArbitraryValue,
};
