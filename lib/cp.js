"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const mkdir_1 = require("./mkdir");
const readdir_1 = require("./readdir");
function stat(file) {
    return new Promise((resolve, reject) => {
        fs.stat(file, (error, stats) => error ? reject(error) : resolve(stats));
    });
}
const copyFile = (srcFile, dest, { newerOnly = false } = {}) => {
    return Promise.all([
        newerOnly && stat(srcFile),
        newerOnly && stat(dest)
    ].filter(Boolean)).then(([srcStats, destStats]) => {
        return !srcStats || srcStats.mtime.getTime() > destStats.mtime.getTime();
    }).catch(() => {
        // We'll only ever get here if the dest does not exist.
        // By the time copyFile() is called the src has already been confirmed to
        // exist.
        return true;
    }).then(shouldCopy => {
        if (shouldCopy) {
            return mkdir_1.default(path.dirname(dest))
                .then(() => {
                return new Promise((resolve, reject) => {
                    const r = fs.createReadStream(srcFile);
                    const w = fs.createWriteStream(dest);
                    r.pipe(w)
                        .on('error', reject)
                        .on('close', resolve);
                });
            });
        }
    });
};
/**
 * Copies a source to a destination.
 *
 * The copy source can be a file or a directory. If the copy source is a
 * directory ends with '/' then the contents of the directory will be copied and
 * not the directory itself.
 *
 * The copy destination can be a file or a directory path ending with '/'. If
 * the copy destination is a directory path then the basename of the copy source
 * will be suffixed to the directory. Any directories that do not exist in the
 * copy destination path will be created during the copy.
 *
 * Options:
 * newerOnly  Only newer files will be copied (if the destination alredy exists)
 * noDot  Determines if dot files should be ignored
 */
function cp(src, dest, { newerOnly = false, noDot = true } = {}) {
    return Promise.all([
        stat(src),
        stat(dest).catch(() => null)
    ]).then(result => {
        const [srcStats, destStats] = result;
        const destIsDirectory = destStats
            ? destStats.isDirectory()
            : dest.endsWith('/');
        if (srcStats.isFile()) {
            const d = destIsDirectory
                ? path.join(dest, path.basename(src))
                : dest;
            return copyFile(src, d, { newerOnly });
        }
        else if (srcStats.isDirectory()) {
            if (!destIsDirectory) {
                return Promise.reject(new Error('Canot copy a directory to a file destination.'));
            }
            return readdir_1.default(src, { filesOnly: true, recursive: true, noDot }).then(files => {
                return Promise.all(files.map(file => {
                    let outFileSuffix = file;
                    // Copy the contents of the source directory and not the directory
                    // itself.
                    if (src.endsWith('/')) {
                        outFileSuffix = path.relative(src, file);
                    }
                    const d = destIsDirectory
                        ? path.join(dest, outFileSuffix)
                        : dest;
                    return copyFile(file, d, { newerOnly });
                }));
            });
        }
        else {
            return Promise.reject(new Error(`Cannot copy from source ${src}`));
        }
    });
}
exports.default = cp;
