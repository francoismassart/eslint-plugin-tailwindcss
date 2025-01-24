/**
 * @fileoverview Rules enforcing best practices while using Tailwind CSS
 * @author François Massart
 */
'use strict';

import { RuleModule } from '@typescript-eslint/utils/ts-eslint';
import { type ESLint } from 'eslint';
import { configs } from './configs';
import { rules } from './rules';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

type RuleKey = keyof typeof rules;

interface Plugin extends Omit<ESLint.Plugin, 'rules'> {
  rules: Record<RuleKey, RuleModule<any, any, any>>;
}

const { name, version } = await import('../package.json');

// import all rules in lib/rules
const plugin: Plugin = {
  meta: {
    name,
    version,
  },
  rules,
  configs,
};
export default plugin;
