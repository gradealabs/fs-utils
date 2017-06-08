# (MY MODULE)

**(Enter an awesome description!)**

## Quick Start

    (npm install garadealabs/mymodule -S)

**(Now explain how you'd quickly use your awesome module.)**

## Building

To build your Node-based module API

    npm run build:node

To build your client UMD module

    npm run build:client

To build both the Node and client API at the same time

    bpm run build

To clean all generated folders

    npm run clean

## Testing

Unit tests are expected to be colocated next to the module/file they are testing
and have the following suffix `.test.js`.

To run unit tests through [istanbul](https://istanbul.js.org/) and
[mocha](http://mochajs.org/)

    npm test

## Maintainence

To check what modules in `node_modules` is outdated

    npm run audit

To update outdated modules while respecting the semver rules in the package.json

    npm update

To update a module to the latest major version (replacing what you have)

    npm install themodule@latest -S (if to save in dependencies)
    npm install themodule@latest -D (if to save in devDependencies)
