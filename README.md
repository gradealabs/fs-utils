# FS Utils

A package that exposes several useful file system utility functions.

## Quick Start

    npm install @gradealabs/fs-utils -S

    import { touch, mkdir } from '@gradealabs/fs-utils'

    mkdir('dest/assets')
      .then(() => touch('dest/assets/.keep'))
      .then(() => console.log('done!'))

## API

**touch(fileName)**

Touches a file by setting the existing file's `mtime` or creating the file if
one does not exist. If a file is created it will be a UTF-8 text file.

Example:

    import { touch } from '@gradealabs/fs-utils'

    touch('.keep')
      .then(() => console.log('touched'))
      .catch(error => console.error(error))

**mkdir(dirPath)**

Makes a directory path and any directories in the path that don't exist.

Example:

    import { mkdir } from '@gradealabs/fs-utils'

    mkdir('dest/scripts/vendor')
      .then(() => console.log('done'))
      .catch(error => console.error(error))

**rmdir(dirPath)**

Removes an empty or non-empty directory.

Example:

    import { rmdir, mkdir } from '@gradealabs/fs-utils'

    mkdir('src/vendor/bootstrap')
      .then(() => rmdir('src'))
      .then(() => console.log('done'))
      .catch(error => console.error(error))

**rmdirfiles(dirPath)**

Removes only the files inside a directory, but not the directory itself.

Example:

    import { rmdirfiles, mkdir, touch } from '@gradealabs/fs-utils'

    Promise.resolve()
      .then(() => mkdir('dist/a'))
      .then(() => mkdir('dist/b'))
      .then(() => touch('dist/file.js'))
      .then(() => rmdirfiles('dist'))
      .then(() => console.log('dist has been cleaned out'))
      .catch(error => console.error(error))

**readdir(dirPath, options)**

Reads a directory and returns a file listing.

Supported options:

- `recursive` {default: false} Recursively traverse sub directories
- `filesOnly` {default: false} Only include files in the listing
- `noDot` {default: true} Do not include any files that start with '.'
- `prefix` {default: true} Prefix the files in the list with the dirPath

Example:

    import { readdir } from '@gradealabs/fs-utils'

    readdir('dest/scripts', { prefix: false, filesOnly: true })
      // Could return an array like: [ 'index.js', 'jquery.min.js' ]
      .then(listing => console.log(listing))
      .catch(error => console.error(error))

**cp(src, dest, options)**

Copies files and/or directories to a destination location.

Supported options:

- `newerOnly` {default: false} Only copy the file if newer than destination file
- `noDot` {default: true} Ignore files that start with '.'

*Copying Directories*

Directories are copied in their entirety, that is the entire directory itself.
However, if you only want the contents of a directory copied then suffix the
source directory path with `'/'` or `'\'`.

*Copying To Directories*

To copy to a directory *and* create it if doesn't exist then suffix the
destination directory path with `'/'` or `'\'`.

Example:

    import { cp } from '@gradealabs/fs-utils'

    // Copy all files in src into dest, where dest will be created if it doesn't
    // exist already.
    // Ends up with something like: dest/index.js, dest/jquery.min.js
    cp('src/', 'dest/')
      .then(() => console.log('copied'))
      .catch(error => console.error(error))


    // Copy src into dest, where dest will be created if it doesn't exist.
    // Ends up with something like: dest/src/index.js, dest/src/jquery.min.js
    cp('src', 'dest/')
      .then(() => console.log('copied'))
      .catch(error => console.error(error))

## Building

To build the source

    npm run build
    bpm run build:node

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
