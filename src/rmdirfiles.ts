import * as fs from 'fs'
import * as path from 'path'
import rmdir from './rmdir'

/**
 * Attempts to delete all the files from a directory, but not the directory
 * itself.
 *
 * @param dir The directory to delete all files from
 * @return A promise that resolves to void.
 */
export default function rmdirfiles (dir: string): Promise<void> {
  return readdir(dir)
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
        resolve(files.map(f => path.join(dir, f)))
      }
    })
  })
}
