"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
/**
 * Makes a directory path and any directories in that path. Similar behaviour as
 * calling `mkdir -p {path}` in Bash.
 */
function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, error => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    }).catch(error => {
        if (error.code === 'EEXIST') {
            return Promise.resolve();
        }
        else if (error.code === 'ENOENT') {
            return mkdir(path.dirname(dir)).then(() => {
                return mkdir(dir);
            });
        }
        else {
            return Promise.reject(error);
        }
    });
}
exports.default = mkdir;
