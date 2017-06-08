# Transpiling

## Scripts

All source code is transpiled with [TypeScript](). TypeScript files are
supported by default, however `allowJs` is enabled so `.js` files are supported.
Type checking is enabled for all `.js` files by having the `checkJs` set.

To make changes to the TypeScript compiler options edit the `tconfig.json` file
in the project root. This config file is inherited by all other TypeScript
config files.

## Styles

All source styles are transpiled using [node-sass](https://npmjs.org/node-sass)
if they end with `.scss` or `.sass`. Any `.css` files will be included in the
bundle without any transpilation.
