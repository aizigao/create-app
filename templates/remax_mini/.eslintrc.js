module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "prettier/react",
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/prop-types": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "prettier/prettier": ["error", {}],
    "react/display-name": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-var-requires": 0,
    "prefer-const": [
      "error",
      {
        destructuring: "any",
        ignoreReadBeforeAssign: true,
      },
    ],
    "react/react-in-jsx-scope": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
