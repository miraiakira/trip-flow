import antfu from "@antfu/eslint-config";

// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(antfu(
  {
    type: "app",
    vue: true,
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    ignores: ["./src/github/schema.docs.graphql"],
  },
  {
    rules: {
      "ts/consistent-type-definitions": ["error", "type"],
      "no-console": ["off"],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "perfectionist/sort-imports": [
        "error",
        {
          tsconfigRootDir: ".",
        },
      ],
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md"],
        },
      ],
    },
  },
));
