/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: "lf",
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    "<TYPES>^(node:)",
    "<TYPES>",
    "<TYPES>^[.]",
    "<BUILTIN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "^(?!.*[.]css$)[./].*$", ".css$",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
}
