module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'eslintspace-before-function-paren': 0,
    'comma-dangle': 'es5',
  },
}
