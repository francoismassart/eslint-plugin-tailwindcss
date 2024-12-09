/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
    // configEmoji: [['recommended', '✅']],
    // ignoreConfig: ['all', 'flat/all', 'flat/recommended'],
    ignoreDeprecatedRules: true,
    // ruleDocNotices: [],
    // ruleDocSectionExclude: [],
    // ruleDocSectionInclude: [],
    ruleDocTitleFormat: 'desc',
    ruleListColumns: [
      'name',
      'description',
      'configsError',
      'configsWarn',
      'fixable',
      'hasSuggestions',
      'requiresTypeChecking',
    ],
    // ruleListSplit: [],
    // urlConfigs: 'https://github.com/...#preset-configs-eslintconfigjs',
  };
  
  module.exports = config;