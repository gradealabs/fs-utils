"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function _readdir(dir) {
    return new Promise((resolve, reject) => {
        /* istanbul ignore next */
        fs.readdir(dir, (error, files) => error ? reject(error) : resolve(files));
    });
}
function stat(file) {
    return new Promise((resolve, reject) => {
        /* istanbul ignore next */
        fs.stat(file, (error, stats) => error ? reject(error) : resolve(stats));
    });
}
/**
 * Reads a directory and returns a file list, where each file in the list is
 * prefixed with the directory path.
 *
 * Options:
 * recursive  Determines if the listing recursively includes subdirectories
 * filesOnly  Determines if only files will be returned in the listing
 * noDot  Determines if dot files will be excluded from the listing
 * prefix Determines if the dirPath should be applied as the prefix to each file before returning
 */
function readdir(dirPath, { recursive = false, filesOnly = false, noDot = true, prefix = true } = {}) {
    return _readdir(dirPath).then(files => {
        return files
            .filter(file => !noDot || file[0] !== '.')
            .map(file => path.join(dirPath, file));
    }).then(files => {
        if (filesOnly || recursive) {
            return Promise.all(files.map(file => stat(file).then(stats => {
                return { path: file, stats };
            }))).then(files => {
                return {
                    files: files
                        .filter(({ stats }) => stats.isFile())
                        .map(({ path }) => path),
                    directories: files
                        .filter(({ stats }) => stats.isDirectory())
                        .map(({ path }) => path)
                };
            });
        }
        else {
            return { files, directories: [] };
        }
    }).then(({ files, directories }) => {
        if (recursive) {
            return Promise.all([].concat(prefix ? files : files.map(file => path.relative(dirPath, file)), directories.map(dir => {
                return [
                    filesOnly ? null : (prefix ? dir : path.relative(dirPath, dir)),
                    readdir(dir, { recursive, filesOnly, noDot, prefix })
                        .then(files => {
                        return prefix
                            ? files
                            : files.map(file => path.join(path.basename(dir), file));
                    })
                ];
            }).reduce((a, b) => a.concat(b), [])).filter(Boolean)).then(files => {
                return files.reduce((a, b) => a.concat(b), []);
            });
        }
        else {
            return filesOnly ? files : files.concat(directories);
        }
    });
}
exports.default = readdir;
