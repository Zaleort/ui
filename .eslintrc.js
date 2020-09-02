module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "max-len": [1, { "code": 120 }],
    "linebreak-style": "off",
    "no-return-assign": "off",
    "vue/max-attributes-per-line": ["error", {
      "singleline": 2,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    "no-explicit-any": "off",
    "no-underscore-dangle": "off",
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "no-param-reassign": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-empty-function": "off",
    "arrow-parens": "off",
    "no-restricted-globals": "off",
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
