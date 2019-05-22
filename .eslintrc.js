const path = require('path');

module.exports = {
  env: {
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    curly: ['error', 'all'],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true
      }
    ],
    'no-console': 'error',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error'
  },
  settings: {
    'import/resolver': {
      typescript: {},
      'eslint-import-resolver-lerna': {
        packages: path.resolve(__dirname, 'packages')
      }
    }
  }
}
