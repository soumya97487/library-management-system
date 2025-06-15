// eslint.config.cjs
const { defineConfig } = require("eslint/config");
const js = require("@eslint/js");
const globals = require("globals");

module.exports = defineConfig([
  {
    ignores: ["node_modules/", ".env"], // ⬅️ replaced .eslintignore

    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],

    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },

    rules: {
      // warn (not error) on unused vars/args, but ignore ones starting with _
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // catch real undefined-variable typos
      "no-undef": "error",
    },
  },
]);
