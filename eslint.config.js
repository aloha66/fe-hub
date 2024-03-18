import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-plugin'

export default antfu(
  unocss.configs.flat,
  {
    rules: {
      'no-restricted-imports': [
        'error',

      ],
      'ts/ban-types': 'off',
      'node/no-callback-literal': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'node/prefer-global/process': 'off',
      'ts/unified-signatures': 'off',
      'ts/no-dynamic-delete': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'jsx-quotes': ['error', 'prefer-single'],
      'no-restricted-syntax': 'off',
      'complexity': ['error', 10],
    },
  },
  // {
  //   files: [
  //     'packages/**/*.ts',
  //     'packages/**/*.test.ts',
  //   ],
  //   rules: {
  //     quotes: [2, 'single'],
  //     singleQuotes: true,
  //     semi: ['error', 'never'],
  //   },
  // },
)
