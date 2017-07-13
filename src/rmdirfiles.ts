import * as fs from 'fs'
import * as path from 'path'
import rmdir from './rmdir'

interface RmDirFilesOptions {
  include?: Array<string | RegExp>
  exclude?: Array<string | RegExp>
}

/**
 * Attempts to delete all the files from a directory, but not the directory
 * itself.
 *
 * Optionally, files directly in the dir can be explicitly included/excluded
 * from being removed. Use either the include or exclude options to determine
 * the file names to include/exclude from the removal operation. These options
 * accept an array of strings or RegExp instances.
 *
 * NOTE: The exclude option takes precedence over include.
 *
 * Example:
 * // Remove all files except the .git folder
 * rmdirfiles('dist', { exclude: [ '.git' ] })
 *
 * * // Remove all files except the .git folder and any file starting with '_'
 * rmdirfiles('dist', { exclude: [ '.git', /^_/ ] })
 *
 * @param dir The directory to delete all files from
 * @param options The options to modify the operation
 * @return A promise that resolves to void.
 */
export default function rmdirfiles (dir: string, options: RmDirFilesOptions = {}): Promise<void> {
  const { include = [ /./ ] , exclude = [] } = options

  return readdir(dir)
    .then(files => files.filter(f => {
      return include.some(x => {
        if (typeof x === 'string') {
          return f === x
        } else if (x instanceof RegExp) {
          return x.test(f)
        } else {
          return false
        }
      })
    }))
    .then(files => {
      return exclude.length
        ? files.filter(f => {
          return !exclude.some(x => {
            if (typeof x === 'string') {
              return f === x
            } else if (x instanceof RegExp) {
              return x.test(f)
            } else {
              return false
            }
          })
        })
        : files
    })
    .then(files => files.map(f => path.join(dir, f)))
    .then(files => {
      return Promise.all(files.map(stat))
        .then(statsList => {
          return Promise.all(
            statsList.map((stats, i) => {
              const file = files[i]

              if (stats.isDirectory()) {
                return rmdir(file)
              } else if (stats.isFile() || stats.isSymbolicLink()) {
                return unlink(file)
              } else {
                /* istanbul ignore next */
                return Promise.reject(
                  new Error(
                    'Can only delete a file, directory or symlink. ' +
                    `Cannot delete file '${file}'`
                  )
                )
              }
            })
          )
        })
        .then(() => {})
    })
}

function stat (fileName: string): Promise<fs.Stats> {
  return new Promise<fs.Stats>((resolve, reject) => {
    fs.stat(fileName, (error, stats) => {
      error ? reject(error) : resolve(stats)
    })
  })
}

function unlink (fileName: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(fileName, error => error ? reject(error) : resolve())
  })
}

function readdir (dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        reject(error)
      } else {
        resolve(files)
      }
    })
  })
}
