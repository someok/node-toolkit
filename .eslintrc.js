module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['plugin:prettier/recommended', 'prettier/react'],
  env: {
    es6: true,
    node: true,
    // browser: true,
  },
  parserOptions: {
    // 支持最新 JavaScript
    ecmaVersion: 10,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {},
  globals: {
    __DEV__: false,
    __CTX__: false,
  },
};
